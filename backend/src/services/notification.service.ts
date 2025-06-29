import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import { BadRequestError } from '../ultils/error.util';
import { formatDateTime } from '../ultils/time.util';

export class NotificationService {
  private prisma: PrismaClient;
  private transporter: nodemailer.Transporter;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true para 465, false para outras portas
      auth: {
        user: process.env.SMTP_USER, // Ex.: seu-email@gmail.com
        pass: process.env.SMTP_PASS, // Senha ou app-specific password
      },
    });
  }

  async scheduleEventReminder(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { attendees: true, user: true },
    });
    if (!event) throw new BadRequestError('Event not found');

    const reminderTime = new Date(event.startTime);
    reminderTime.setMinutes(reminderTime.getMinutes() - 15); // Lembrete 15 minutos antes

    // Agenda o lembrete se ainda estiver no futuro
    if (reminderTime > new Date()) {
      cron.schedule(`0 ${reminderTime.getMinutes()} ${reminderTime.getHours()} * * *`, () => {
        this.sendReminderEmail(event);
      }, {
        timezone: event.user.timezone || 'UTC',
      });
    }
  }

  private async sendReminderEmail(event: any) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: event.attendees.map((a: any) => a.email).join(', '),
      subject: `Reminder: ${event.title}`,
      text: `Hello,\n\nThis is a reminder for the event "${event.title}" scheduled for ${formatDateTime(event.startTime, event.user.timezone)}.\nDetails: ${event.description || 'No description'}\nLocation: ${event.location || 'Not specified'}\n\nRegards,\nYour Calendar App`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Reminder email sent for event ${event.id}`);
    } catch (error) {
      console.error('Failed to send reminder email:', error);
    }
  }
}
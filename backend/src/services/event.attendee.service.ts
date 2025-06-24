import { PrismaClient } from '@prisma/client';
import { BadRequestError } from '../ultils/error.util';
import { CreateAttendeeDTO, UpdateAttendeeDTO } from '../dtos/event.attendee.dto';

export class EventAttendeeService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createAttendee(data: CreateAttendeeDTO) {
    // Verifica se o evento existe
    const event = await this.prisma.event.findUnique({ where: { id: data.eventId } });
    if (!event) throw new BadRequestError('Event not found');

    // Verifica se o email já está associado ao evento
    const existingAttendee = await this.prisma.eventAttendee.findUnique({
      where: { eventId_email: { eventId: data.eventId, email: data.email } },
    });
    if (existingAttendee) throw new BadRequestError('Attendee already exists for this event');

    return this.prisma.eventAttendee.create({
      data: {
        eventId: data.eventId,
        email: data.email,
        name: data.name,
        status: data.status,
        role: data.role,
      },
    });
  }

  async getAttendees(eventId: string) {
    return this.prisma.eventAttendee.findMany({ where: { eventId } });
  }

  async getAttendeeById(id: string) {
    const attendee = await this.prisma.eventAttendee.findUnique({ where: { id } });
    if (!attendee) throw new BadRequestError('Attendee not found');
    return attendee;
  }

  async updateAttendee(id: string, data: UpdateAttendeeDTO) {
    const attendee = await this.prisma.eventAttendee.findUnique({ where: { id } });
    if (!attendee) throw new BadRequestError('Attendee not found');

    return this.prisma.eventAttendee.update({
      where: { id },
      data: {
        name: data.name,
        status: data.status,
        role: data.role,
      },
    });
  }

  async deleteAttendee(id: string) {
    const attendee = await this.prisma.eventAttendee.findUnique({ where: { id } });
    if (!attendee) throw new BadRequestError('Attendee not found');

    await this.prisma.eventAttendee.delete({ where: { id } });
  }
}
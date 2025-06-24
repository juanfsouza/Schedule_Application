import cron from 'node-cron';

export class NotificationService {
  static scheduleReminder(event: any) {
    cron.schedule(`0 ${new Date(event.startTime).getMinutes()} ${new Date(event.startTime).getHours()} * * *`, () => {
      console.log(`Reminder: ${event.title} at ${event.startTime}`);
      // Implementar envio de e-mail ou notificação aqui
    });
  }
}
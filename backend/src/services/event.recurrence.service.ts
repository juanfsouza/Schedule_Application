import { PrismaClient } from '@prisma/client';
import { CreateRecurrenceDTO, UpdateRecurrenceDTO } from '../dtos/eventRecurrence.dto';
import { BadRequestError } from '../ultils/error.util';

export class EventRecurrenceService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createRecurrence(eventId: string, data: CreateRecurrenceDTO) {
    // Verifica se o evento existe
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new BadRequestError('Event not found');

    return this.prisma.eventRecurrence.create({
      data: {
        eventId,
        frequency: data.frequency,
        interval: data.interval,
        daysOfWeek: data.daysOfWeek,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        count: data.count,
      },
    });
  }

  async getRecurrences(eventId: string) {
    return this.prisma.eventRecurrence.findMany({ where: { eventId } });
  }

  async updateRecurrence(id: string, data: UpdateRecurrenceDTO) {
    // Verifica se a recorrência existe
    const recurrence = await this.prisma.eventRecurrence.findUnique({ where: { id } });
    if (!recurrence) throw new BadRequestError('Recurrence not found');

    return this.prisma.eventRecurrence.update({
      where: { id },
      data: {
        frequency: data.frequency,
        interval: data.interval,
        daysOfWeek: data.daysOfWeek,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        count: data.count,
      },
    });
  }

  async deleteRecurrence(id: string) {
    // Verifica se a recorrência existe
    const recurrence = await this.prisma.eventRecurrence.findUnique({ where: { id } });
    if (!recurrence) throw new BadRequestError('Recurrence not found');

    await this.prisma.eventRecurrence.delete({ where: { id } });
  }
}
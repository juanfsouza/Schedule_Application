import { PrismaClient } from '@prisma/client';
import { CreateRecurrenceDTO, UpdateRecurrenceDTO } from '../dtos/eventRecurrence.dto';

export class EventRecurrenceRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(eventId: string, data: CreateRecurrenceDTO) {
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

  async findByEventId(eventId: string) {
    return this.prisma.eventRecurrence.findUnique({
      where: { eventId },
    });
  }

  async findAll() {
    return this.prisma.eventRecurrence.findMany();
  }

  async findById(id: string) {
    return this.prisma.eventRecurrence.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateRecurrenceDTO) {
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

  async delete(id: string) {
    await this.prisma.eventRecurrence.delete({
      where: { id },
    });
  }
}
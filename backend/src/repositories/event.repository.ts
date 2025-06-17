import { PrismaClient } from '@prisma/client';
import { CreateEventDTO } from '../dtos/event.dto';

export class EventRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: CreateEventDTO & { userId: string }) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        allDay: data.allDay,
        color: data.color,
        location: data.location,
        userId: data.userId,
        calendarId: data.calendarId,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
    });
  }
}
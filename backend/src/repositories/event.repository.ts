import { EventType, PrismaClient } from '@prisma/client';
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
        status: data.status,
        type: data.type,
        isRecurring: data.isRecurring,
      },
      include: { calendar: true, recurrence: true, attendees: true },
    });
  }

  async findMany(where: { userId: string; type?: EventType }) {
    return this.prisma.event.findMany({
      where,
      include: { calendar: true, recurrence: true, attendees: true },
    });
  }

  async findById(id: string) {
    return this.prisma.event.findUnique({
      where: { id },
      include: { calendar: true, recurrence: true, attendees: true },
    });
  }

  async update(id: string, data: Partial<CreateEventDTO>) {
    return this.prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime ? new Date(data.startTime) : undefined,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
        allDay: data.allDay,
        color: data.color,
        location: data.location,
        status: data.status,
        type: data.type,
        isRecurring: data.isRecurring,
        calendarId: data.calendarId,
      },
      include: { calendar: true, recurrence: true, attendees: true },
    });
  }

  async delete(id: string) {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}
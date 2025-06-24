import { EventRepository } from '../repositories/event.repository';
import { CreateEventDTO } from '../dtos/event.dto';
import { EventType, PrismaClient } from '@prisma/client';
import { BadRequestError } from '../ultils/error.util';
import { isValidTimeRange } from '../ultils/time.util';

export class EventService {
  getEventById(id: string) {
    throw new Error('Method not implemented.');
  }
  updateEvent(id: string, body: any) {
    throw new Error('Method not implemented.');
  }
  deleteEvent(id: string) {
    throw new Error('Method not implemented.');
  }
  private eventRepository: EventRepository;
  private prisma: PrismaClient;

  constructor(eventRepository: EventRepository, prisma: PrismaClient) {
    this.eventRepository = eventRepository;
    this.prisma = prisma;
  }

  async createEvent(data: CreateEventDTO, userId: string) {
    const calendar = await this.prisma.calendar.findFirst({
      where: { id: data.calendarId, userId },
    });

    if (!calendar) throw new BadRequestError('Invalid calendar');

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    if (start >= end) throw new BadRequestError('Start time must be before end time');

    const workingHours = await this.prisma.workingHours.findUnique({ where: { userId } });
    if (workingHours && !isValidTimeRange(start, end, { start: workingHours.mondayStart || 0, end: workingHours.mondayEnd || 24 })) {
      throw new BadRequestError('Event outside working hours');
    }

    return this.eventRepository.create({ ...data, userId });
  }

  async getEvents(userId: string, category?: string) {
    const whereClause: { userId: string; type?: EventType } = { userId };
    if (category) {
      whereClause.type = category as EventType;
    }
    return this.prisma.event.findMany({
      where: whereClause,
      include: { calendar: true, recurrence: true, attendees: true },
    });
  }
}
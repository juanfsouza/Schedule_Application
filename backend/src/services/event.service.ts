import { EventRepository } from '../repositories/event.repository';
import { CreateEventDTO } from '../dtos/event.dto';
import { PrismaClient } from '@prisma/client';
import { BadRequestError } from '../ultils/error.util';

export class EventService {
  private eventRepository: EventRepository;
  private prisma: PrismaClient;

  constructor(eventRepository: EventRepository, prisma: PrismaClient) {
    this.eventRepository = eventRepository;
    this.prisma = prisma;
  }

  async createEvent(data: CreateEventDTO, userId: string) {
    // Validate calendar exists and belongs to user
    const calendar = await this.prisma.calendar.findFirst({
      where: { id: data.calendarId, userId },
    });

    if (!calendar) {
      throw new BadRequestError('Invalid calendar');
    }

    // Validate startTime < endTime
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    if (start >= end) {
      throw new BadRequestError('Start time must be before end time');
    }

    return this.eventRepository.create({ ...data, userId });
  }
}
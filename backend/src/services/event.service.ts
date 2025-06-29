import { EventRepository } from '../repositories/event.repository';
import { CreateEventDTO, UpdateEventDTO } from '../dtos/event.dto';
import { EventType, PrismaClient } from '@prisma/client';
import { BadRequestError } from '../ultils/error.util';
import { isValidTimeRange } from '../ultils/time.util';
import { NotificationService } from './notification.service';

export class EventService {
  private eventRepository: EventRepository;
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(eventRepository: EventRepository, prisma: PrismaClient) {
    this.eventRepository = eventRepository;
    this.prisma = prisma;
    this.notificationService = new NotificationService(prisma);
  }

  async createEvent(data: CreateEventDTO, userId: string) {
    const calendar = await this.prisma.calendar.findFirst({
      where: { id: data.calendarId, userId },
    });

    if (!calendar) throw new BadRequestError('Invalid calendar');

    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestError('Invalid datetime format');
    }
    if (start >= end) throw new BadRequestError('Start time must be before end time');

    const workingHours = await this.prisma.workingHours.findUnique({ where: { userId } });
    if (workingHours && !isValidTimeRange(start, end, { start: workingHours.mondayStart || 0, end: workingHours.mondayEnd || 24 })) {
      throw new BadRequestError('Event outside working hours');
    }

    const event = await this.eventRepository.create({ ...data, userId });
    try {
      await this.notificationService.scheduleEventReminder(event.id);
    } catch (error) {
      console.error('Failed to schedule reminder:', error);
    }
    return event;
  }

  async getEvents(userId: string, category?: string) {
    const whereClause: { userId: string; type?: EventType } = { userId };
    if (category) {
      const validCategories = Object.values(EventType);
      if (!validCategories.includes(category as EventType)) {
        throw new BadRequestError('Invalid event category');
      }
      whereClause.type = category as EventType;
    }
    return this.eventRepository.findMany(whereClause);
  }

  async getEventById(id: string) {
    const event = await this.eventRepository.findById(id);
    if (!event) throw new BadRequestError('Event not found');
    return event;
  }

  async updateEvent(id: string, data: UpdateEventDTO) {
    const event = await this.getEventById(id);
    const start = data.startTime ? new Date(data.startTime) : new Date(event.startTime);
    const end = data.endTime ? new Date(data.endTime) : new Date(event.endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestError('Invalid datetime format');
    }
    if (start >= end) throw new BadRequestError('Start time must be before end time');

    const workingHours = await this.prisma.workingHours.findUnique({ where: { userId: event.userId } });
    if (workingHours && !isValidTimeRange(start, end, { start: workingHours.mondayStart || 0, end: workingHours.mondayEnd || 24 })) {
      throw new BadRequestError('Event outside working hours');
    }

    return this.eventRepository.update(id, {
      title: data.title,
      description: data.description,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      allDay: data.allDay,
      color: data.color,
      location: data.location,
      status: data.status,
      type: data.type,
      isRecurring: data.isRecurring,
      calendarId: data.calendarId,
    });
  }

  async deleteEvent(id: string) {
    await this.getEventById(id); // Validates existence
    await this.eventRepository.delete(id);
  }
}
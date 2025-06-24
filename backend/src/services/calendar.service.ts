import { CalendarRepository } from '../repositories/calendar.repository';
import { CreateCalendarDTO } from '../dtos/calendar.dto';
import { BadRequestError } from '../ultils/error.util';

export class CalendarService {
  private calendarRepository: CalendarRepository;

  constructor(calendarRepository: CalendarRepository) {
    this.calendarRepository = calendarRepository;
  }

  async createCalendar(data: CreateCalendarDTO, userId: string) {
    return this.calendarRepository.create({ ...data, userId });
  }

  async getCalendars(userId: string) {
    return this.calendarRepository.findAll({ where: { userId } });
  }

  async getCalendarById(id: string) {
    const calendar = await this.calendarRepository.findById(id);
    if (calendar == null) throw new BadRequestError('Calendar not found');
    return calendar;
  }

  async updateCalendar(id: string, data: Partial<CreateCalendarDTO>) {
    const calendar = await this.calendarRepository.findById(id);
    if (calendar == null) throw new BadRequestError('Calendar not found');
    return this.calendarRepository.update(id, data);
  }

  async deleteCalendar(id: string) {
    const calendar = await this.calendarRepository.findById(id);
    if (calendar == null) throw new BadRequestError('Calendar not found');
    await this.calendarRepository.delete(id);
  }
}
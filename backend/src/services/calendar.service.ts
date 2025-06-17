import { CalendarRepository } from '../repositories/calendar.repository';
import { CreateCalendarDTO } from '../dtos/calendar.dto';

export class CalendarService {
    private calendarRepository: CalendarRepository;

    constructor(calendarRepository: CalendarRepository) {
    this.calendarRepository = calendarRepository;
    }

    async createCalendar(data: CreateCalendarDTO, userId: string) {
    return this.calendarRepository.create({ ...data, userId });
    }
}
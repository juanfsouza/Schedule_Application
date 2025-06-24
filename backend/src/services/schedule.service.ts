import { CreateScheduleDTO } from '../dtos/schedule.dto';
import { ScheduleRepository } from '../repositories/schedule.repository';
import { BadRequestError } from '../ultils/error.util';

export class ScheduleService {
  private scheduleRepository: ScheduleRepository;

  constructor(scheduleRepository: ScheduleRepository) {
    this.scheduleRepository = scheduleRepository;
  }

  async createSchedule(data: CreateScheduleDTO, userId: string) {
    // Verifica se o tipo de schedule já existe para o usuário
    const existingSchedule = await this.scheduleRepository.findByTypeAndUserId(data.type, userId);
    if (existingSchedule) {
      throw new BadRequestError('Schedule type already exists for this user');
    }

    // Cria um novo schedule
    return this.scheduleRepository.create({
      ...data,
      userId,
    });
  }

  async getSchedules(userId: string) {
    // Retorna todos os schedules do usuário
    return this.scheduleRepository.findAllByUserId(userId);
  }
}
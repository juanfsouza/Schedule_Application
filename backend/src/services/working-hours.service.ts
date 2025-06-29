import { WorkingHoursRepository } from '../repositories/working-hours.repository';
import { BadRequestError } from '../ultils/error.util';

export class WorkingHoursService {
  private workingHoursRepository: WorkingHoursRepository;

  constructor(workingHoursRepository: WorkingHoursRepository) {
    this.workingHoursRepository = workingHoursRepository;
  }

  async createWorkingHours(data: any, userId: string) {
    const existing = await this.workingHoursRepository.findByUserId(userId);
    if (existing) throw new BadRequestError('Working hours already set for this user');
    return this.workingHoursRepository.create({ ...data, userId });
  }

  async getWorkingHours(userId: string) {
    const workingHours = await this.workingHoursRepository.findByUserId(userId);
    if (!workingHours) throw new BadRequestError('Working hours not found');
    return workingHours;
  }

  async updateWorkingHours(id: string, data: any) {
    return this.workingHoursRepository.update(id, data);
  }

  async deleteWorkingHours(id: string) {
    return this.workingHoursRepository.delete(id);
  }
}
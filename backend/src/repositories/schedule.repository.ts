import { PrismaClient } from '@prisma/client';
import { CreateScheduleDTO } from '../dtos/schedule.dto';

export class ScheduleRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: CreateScheduleDTO & { userId: string }) {
    return this.prisma.schedule.create({
      data: {
        name: data.name,
        type: data.type,
        color: data.color,
        userId: data.userId,
      },
    });
  }

  async findByTypeAndUserId(type: string, userId: string) {
    return this.prisma.schedule.findFirst({
      where: { type, userId },
    });
  }

  async findAllByUserId(userId: string) {
    return this.prisma.schedule.findMany({
      where: { userId },
    });
  }
}
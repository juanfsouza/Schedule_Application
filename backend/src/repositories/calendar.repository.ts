import { PrismaClient } from '@prisma/client';
import { CreateCalendarDTO } from '../dtos/calendar.dto';

export class CalendarRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: CreateCalendarDTO & { userId: string }) {
    return this.prisma.calendar.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        isDefault: data.isDefault,
        isVisible: data.isVisible,
        userId: data.userId,
      },
    });
  }

  async findAll({ where }: { where: { userId: string } }) {
    return this.prisma.calendar.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.calendar.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Partial<CreateCalendarDTO>) {
    return this.prisma.calendar.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.calendar.delete({
      where: { id },
    });
  }
}
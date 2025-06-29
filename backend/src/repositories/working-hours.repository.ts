import { PrismaClient } from '@prisma/client';

export class WorkingHoursRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: any & { userId: string }) {
    return this.prisma.workingHours.create({
      data,
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.workingHours.findUnique({
      where: { userId },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.workingHours.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.workingHours.delete({
      where: { id },
    });
  }
}
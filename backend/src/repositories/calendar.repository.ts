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
}
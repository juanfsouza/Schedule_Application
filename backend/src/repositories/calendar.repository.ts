import { PrismaClient } from '@prisma/client';
import { CreateCalendarDTO } from '../dtos/calendar.dto';

export class CalendarRepository {
    findAll(arg0: { where: { userId: string; }; }) {
        throw new Error('Method not implemented.');
    }
    findById(id: string) {
        throw new Error('Method not implemented.');
    }
    update(id: string, data: Partial<{ name: string; color: string; isDefault: boolean; isVisible: boolean; description?: string | undefined; }>) {
        throw new Error('Method not implemented.');
    }
    delete(id: string) {
        throw new Error('Method not implemented.');
    }
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
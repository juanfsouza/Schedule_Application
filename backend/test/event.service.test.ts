import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prismaMock = {
  event: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
  },
  calendar: {
    findFirst: vi.fn(),
  },
  workingHours: {
    findUnique: vi.fn(),
  },
};

const eventRepositoryMock = {
  create: vi.fn(),
};

const eventService = new eventService(eventRepositoryMock, prismaMock);

describe('EventService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an event successfully', async () => {
    const mockData: CreateEventDTO = {
      title: 'Test Event',
      startTime: '2025-06-24T10:00:00-03:00',
      endTime: '2025-06-24T11:00:00-03:00',
      calendarId: 'uuid-456',
    };

    (prismaMock.calendar.findFirst as any).mockResolvedValue({ id: 'uuid-456', userId: 'uuid-123' });
    prismaMock.workingHours.findUnique.mockResolvedValue({ mondayStart: 9, mondayEnd: 17 });
    eventRepositoryMock.create.mockResolvedValue({ id: 'uuid-789', ...mockData, userId: 'uuid-123' });

    const result = await eventService.createEvent(mockData, 'uuid-123');
    expect(result).toHaveProperty('id', 'uuid-789');
    expect(eventRepositoryMock.create).toHaveBeenCalledWith(expect.objectContaining(mockData));
  });

  it('should throw error if calendar is invalid', async () => {
    const mockData: CreateEventDTO = {
      title: 'Test Event',
      startTime: '2025-06-24T10:00:00-03:00',
      endTime: '2025-06-24T11:00:00-03:00',
      calendarId: 'uuid-456',
    };

    (prismaMock.calendar.findFirst as any).mockResolvedValue(null);

    await expect(eventService.createEvent(mockData, 'uuid-123')).rejects.toThrow('Invalid calendar');
  });
});
import { PrismaClient } from '@prisma/client';
import { RegisterDTO } from '../dtos/auth.dto';
import { UpdateUserDTO } from '../dtos/user.dto';
import { BadRequestError } from '../ultils/error.util';

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: RegisterDTO & { password: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        timezone: data.timezone,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(where: { where: { id?: string } }) {
    return this.prisma.user.findMany({
      where: where.where, // Desestrutura o objeto para usar o where interno
    });
  }

  async update(id: string, data: UpdateUserDTO) {
    const user = await this.findById(id);
    if (!user) throw new BadRequestError('User not found');

    return this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        timezone: data.timezone,
      },
    });
  }

  async delete(id: string) {
    const user = await this.findById(id);
    if (!user) throw new BadRequestError('User not found');

    await this.prisma.user.delete({
      where: { id },
    });
  }
}
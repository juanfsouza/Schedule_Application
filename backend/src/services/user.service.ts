import { UserRepository } from '../repositories/user.repository';
import { BadRequestError } from '../ultils/error.util';
import { RegisterUserDTO, UpdateUserDTO } from '../dtos/user.dto';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUsers(userId: string) {
    return this.userRepository.findAll({ where: { id: userId } }); // Filtrar por usuário autenticado
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new BadRequestError('User not found');
    return user;
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new BadRequestError('User not found');
    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new BadRequestError('User not found');
    await this.userRepository.delete(id);
  }

  // Método para registro (opcional, pode ser movido para AuthService)
  async register(data: RegisterUserDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) throw new BadRequestError('Email already in use');
    return this.userRepository.create(data); // Ajuste o repositório para aceitar RegisterUserDTO
  }
}
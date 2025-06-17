import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDTO, LoginDTO } from '../dtos/auth.dto';
import { BadRequestError, UnauthorizedError } from '../ultils/error.util';
import { signToken } from '../ultils/jwt.util';

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async register(data: RegisterDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const token = signToken({ id: user.id, role: user.role });
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }

  async login(data: LoginDTO) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = signToken({ id: user.id, role: user.role });
    return { user: { id: user.id, email: user.email, name: user.name }, token };
  }
}
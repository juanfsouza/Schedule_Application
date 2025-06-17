import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
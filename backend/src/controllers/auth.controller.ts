import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { validate } from '../middleware/validator.middleware';
import { registerSchema, loginSchema } from '../dtos/auth.dto';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  register = [
    validate(registerSchema),
    async (req: Request, res: Response) => {
      const data = req.body;
      const result = await this.authService.register(data);
      return res.status(201).json({
        status: 'success',
        data: result,
      });
    },
  ];

  login = [
    validate(loginSchema),
    async (req: Request, res: Response) => {
      const data = req.body;
      const result = await this.authService.login(data);
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    },
  ];
}
import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { errorMiddleware } from './middleware/error.middleware';
import { routes } from './routes';

export class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
      })
    );
  }

  private initializeRoutes() {
    this.app.use('/api', routes);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen(port: number | string, callback: () => void) {
    this.app.listen(port, callback);
  }

  public getApp() {
    return this.app;
  }
}
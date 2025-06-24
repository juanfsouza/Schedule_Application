import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || '7e891cc81d7b87d2561c485d8394e364379b9319486a8bebb26a1f15bd3923be',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:123@localhost:5432/scheduling_db',
  environment: process.env.NODE_ENV || 'development',
  timezoneDefault: 'UTC',
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100, 
  },
};

export default config;
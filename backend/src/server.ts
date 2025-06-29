import express from 'express';
import { routes } from './routes';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://seusite.com',
  credentials: true,
}));

app.use('/api', routes);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
import { App } from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = new App();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
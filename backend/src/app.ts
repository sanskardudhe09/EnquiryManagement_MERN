import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import enquiryRoutes from './routes/enquiryRoutes';
import { errorHandler } from './middlewares/errorHandler';

config();

export const createApp = (): Application => {
  const app = express();

  if (process.env.NODE_ENV !== 'test') {
    connectDB();
  }

  app.use(helmet());
  app.use(
    cors({
      origin: ['http://localhost:5173', 'https://enquiry-management-mern-frontend.vercel.app/'],
      credentials: true,
    })
  );
  app.use(express.json());

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/enquiries', enquiryRoutes);

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' });
  });

  app.use(errorHandler);

  return app;
};

if (require.main === module) {
  const app = createApp();
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

export default createApp();

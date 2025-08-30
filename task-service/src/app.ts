import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import { logger } from './utils/logger';

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(taskRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

export default app;

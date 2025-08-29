import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import { logger } from "./utils/logger";

const app = express();

app.use(express.json());

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(authRoutes);

app.use(errorHandler);

export default app;

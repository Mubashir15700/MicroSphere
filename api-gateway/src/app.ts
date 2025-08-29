import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import proxyRoutes from "./routes/proxyRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import { corsConfig } from "./config/corsConfig";
import { rateLimitConfig } from "./config/rateLimitConfig";
import { logger } from "./utils/logger";

const app = express();

// Pipe morgan logs to winston
const stream = {
  write: (message: string) => logger.http(message.trim()),
};

app.use(morgan("combined", { stream }));

// app.use(helmet());

app.use(rateLimit(rateLimitConfig));

app.use(cors(corsConfig));

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(proxyRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;

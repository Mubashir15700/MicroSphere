import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import proxyRoutes from "./routes/proxyRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import { corsConfig } from "./config/corsConfig";
import { rateLimitConfig } from "./config/rateLimitConfig";
import { logger } from "./utils/logger";

const app = express();

app.use(helmet());

app.use(rateLimit(rateLimitConfig));

app.use(cors(corsConfig));

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(proxyRoutes);

app.use(errorHandler);

export default app;

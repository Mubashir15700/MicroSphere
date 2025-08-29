import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
};

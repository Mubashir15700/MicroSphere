import { Response } from 'express';
import { logger } from './logger';

export const handleError = (
  res: Response,
  error: any,
  customMessage: string = 'Something went wrong'
) => {
  logger.error(error);

  res.status(500).json({
    message: error.message || customMessage,
    ...(process.env.NODE_ENV === 'development' && { error: error.stack }),
  });
};

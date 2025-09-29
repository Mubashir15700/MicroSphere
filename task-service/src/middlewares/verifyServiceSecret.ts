import { Request, Response, NextFunction } from 'express';
import { SERVICE_SECRET } from '../config/envConfig';

export function verifyServiceSecret(req: Request, res: Response, next: NextFunction) {
  const secret = req.headers['x-service-secret'];
  if (!secret || secret !== SERVICE_SECRET) {
    return res.status(403).json({ message: 'Forbidden: invalid service secret' });
  }
  next();
}

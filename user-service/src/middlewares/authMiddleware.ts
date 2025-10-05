import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET, INTERNAL_AUTH } from '../config/envConfig';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  } & JwtPayload;
}

interface JwtUser {
  id: string;
  email: string;
  role: string;
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded as JwtUser;
    next();
  });
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if ((req.user as JwtUser)?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

export const verifyUserOrService = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const secret = req.headers['x-internal-auth'];

  if (secret === INTERNAL_AUTH) {
    return next();
  }

  verifyToken(req, res, (err?: any) => {
    if (err) return; // verifyToken already sent response
    if ((req.user as JwtUser)?.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Invalid credentials' });
  });
};

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/envConfig';
import { createUser, getUserByEmail } from '../services/userService';
import { handleError } from '../utils/errorHandler';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email and password required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7h',
    });

    res.status(201).json({ token });
  } catch (error: any) {
    if (error.response?.status === 400) {
      return res.status(400).json({ message: 'User already exists or invalid data' });
    }
    handleError(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await getUserByEmail(email);

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '7h',
    });

    res.json({ token });
  } catch (error: any) {
    if (error.response?.status === 404) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    handleError(res, error);
  }
};

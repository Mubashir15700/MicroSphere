import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/userModel';
import { REDIS_CACHE_TTL } from '../config/envConfig';
import redisClient from '../services/redisService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import handleError from '../utils/errorHandler';
import logger from '../utils/logger';

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

const hasAccess = (reqUser: { id: string; role: string }, targetId: string) => {
  return reqUser.role === 'admin' || reqUser.id === targetId;
};

const clearCache = async () => {
  try {
    await redisClient.del('users:all');
    logger.info('User cache cleared');
  } catch (err) {
    logger.error('Failed to clear user cache:', err);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    clearCache();

    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: 'Email already in use' });
    }
    handleError(res, error);
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'users:all';

    try {
      const cachedUsers = await redisClient.get(cacheKey);
      if (cachedUsers) {
        logger.info('Returning users from cache');
        return res.json(JSON.parse(cachedUsers));
      }
    } catch (err) {
      logger.warn(`Redis get failed — continuing without cache: ${err}`);
    }

    const users = await User.find().select('-password');

    try {
      await redisClient.setEx(cacheKey, REDIS_CACHE_TTL, JSON.stringify(users));
    } catch (err) {
      logger.warn(`Redis setEx failed — skipping cache set: ${err}`);
    }

    res.json(users);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!hasAccess(req.user!, id)) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!hasAccess(req.user!, id)) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) {
      user.name = name;
    }
    if (email !== undefined) {
      user.email = email;
    }

    await user.save();

    clearCache();

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error: any) {
    handleError(res, error);
  }
};

export const deleteUsers = async (req: Request, res: Response) => {
  try {
    const { id, includeAdmins } = req.query;

    if (id) {
      if (!isValidObjectId(id as string)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      clearCache();

      return res.status(200).json({ message: 'User deleted successfully' });
    }

    const deleteAllUsers = includeAdmins === 'true';
    const filter = deleteAllUsers ? {} : { role: { $ne: 'admin' } };

    const result = await User.deleteMany(filter);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No users found to delete' });
    }

    clearCache();

    res.status(200).json({ message: `${result.deletedCount} users have been deleted.` });
  } catch (error: any) {
    handleError(res, error);
  }
};

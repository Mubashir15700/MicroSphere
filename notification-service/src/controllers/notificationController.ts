import { Response } from 'express';
import { prisma } from '../prisma';
import { REDIS_CACHE_TTL } from '../config/envConfig';
import redisClient from '../services/redisService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import handleError from '../utils/errorHandler';
import clearCache from '../utils/cache';
import logger from '../utils/logger';

export const getAllNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const cacheKey = 'notifications:all';

    try {
      const cachedNotifications = await redisClient.get(cacheKey);
      if (cachedNotifications) {
        logger.info('Returning notifications from cache');
        return res.json(JSON.parse(cachedNotifications));
      }
    } catch (err) {
      logger.warn(`Redis get failed — continuing without cache: ${err}`);
    }

    const notifications = await prisma.notification.findMany({ where: { userId: user.id } });

    try {
      await redisClient.setEx(cacheKey, REDIS_CACHE_TTL, JSON.stringify(notifications));
    } catch (err) {
      logger.warn(`Redis setEx failed — skipping cache set: ${err}`);
    }

    res.json(notifications);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const updateNotification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    if (typeof isRead !== 'boolean') {
      return res.status(400).json({ message: 'Invalid "isRead" value. Must be boolean.' });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: Number(id) },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: Number(id) },
      data: { isRead },
    });

    await redisClient.del('notifications:all');
    clearCache();

    res.status(200).json({
      message: 'Notification read status updated successfully',
      notification: updatedNotification,
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

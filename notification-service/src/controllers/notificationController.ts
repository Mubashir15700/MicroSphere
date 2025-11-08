import { Response } from 'express';
import { prisma } from '../prisma';
import { REDIS_CACHE_TTL } from '../config/envConfig';
import redisClient from '../services/redisService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import handleError from '../utils/errorHandler';
// import clearCache from '../utils/cache';
import logger from '../utils/logger';

export const getAllNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const cacheKey = `notifications:user:${user.id}`;

    try {
      const cachedNotifications = await redisClient.get(cacheKey);
      if (cachedNotifications) {
        logger.info('Returning notifications from cache');
        return res.json(JSON.parse(cachedNotifications));
      }
    } catch (err) {
      logger.error(`Redis get failed — continuing without cache: ${err}`);
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      select: { id: true, message: true, createdAt: true, isRead: true },
    });

    redisClient
      .setEx(cacheKey, REDIS_CACHE_TTL, JSON.stringify(notifications))
      .catch(err => logger.warn(`Redis setEx failed: ${err}`));

    res.json(notifications);
  } catch (error: any) {
    handleError(res, error);
  }
};

export const updateNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ids, isRead } = req.body;

    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'number')) {
      return res.status(400).json({ message: 'Invalid "ids". Must be an array of numbers.' });
    }

    if (typeof isRead !== 'boolean') {
      return res.status(400).json({ message: 'Invalid "isRead" value. Must be boolean.' });
    }

    const notifications = await prisma.notification.findMany({
      where: { id: { in: ids } },
    });

    if (!notifications.length) {
      return res.status(404).json({ message: 'No notifications found for the given IDs' });
    }

    const updatedNotifications = await prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: { isRead },
    });

    if (redisClient) {
      await redisClient.del(`notifications:user:${req.user?.id}`);
    }
    // clearCache();

    res.status(200).json({
      message: 'Notifications read status updated successfully',
      updatedCount: updatedNotifications.count,
    });
  } catch (error: any) {
    handleError(res, error);
  }
};

import redisClient from '../services/redisService';
import logger from './logger';

const clearCache = async () => {
  try {
    await redisClient.del('users:all');
    logger.info('User cache cleared');
  } catch (err) {
    logger.error('Failed to clear user cache:', err);
  }
};

export default clearCache;

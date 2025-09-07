import { createClient } from 'redis';
import { REDIS_URL } from '../config/envConfig';
import logger from '../utils/logger';

const redisClient = createClient({
  url: REDIS_URL,
  disableOfflineQueue: true,
});

redisClient.on('error', err => {
  logger.error(`Redis Client Error: ${err}`);
});

export default redisClient;

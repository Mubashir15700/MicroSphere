import app from './app';
import { connectPrisma, disconnectPrisma } from './prisma';
import connectToRabbitMQ from './services/rabbitmqService';
import redisClient from './services/redisService';
import { PORT } from './config/envConfig';
import logger from './utils/logger';

const handleGracefulShutdown = (server: any) => {
  ['SIGINT', 'SIGTERM'].forEach(signal =>
    process.on(signal, async () => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectPrisma();
        await redisClient.close();
        logger.info('Prisma and Redis connection closed.');
        logger.info('Server closed.');
        process.exit(0);
      });
    })
  );

  process.on('unhandledRejection', reason => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });

  process.on('uncaughtException', err => {
    logger.error(`Uncaught Exception: ${err}`);
    process.exit(1);
  });
};

(async () => {
  try {
    await connectPrisma();

    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
        logger.info('Connected to Redis');
      }
    } catch (err) {
      logger.error(`Failed to connect to Redis: ${err}`);
      process.exit(1);
    }

    const server = app.listen(PORT, async () => {
      logger.info(`Notification Service listening on port ${PORT}`);

      try {
        await connectToRabbitMQ();
        logger.info('Connected to RabbitMQ');
      } catch (err) {
        logger.error(`Failed to connect to RabbitMQ: ${err}`);
        process.exit(1);
      }
    });

    handleGracefulShutdown(server);
  } catch (err) {
    logger.error(`Failed to connect to Prisma: ${err}`);
    process.exit(1);
  }
})();

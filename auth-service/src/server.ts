import app from './app';
import { PORT } from './config/envConfig';
import { connectToRabbitMQ } from './services/rabbitmqService';
import logger from './utils/logger';

const server = app.listen(PORT, async () => {
  logger.info(`Auth service listening on port ${PORT}`);

  try {
    await connectToRabbitMQ();
    logger.info('Connected to RabbitMQ');
  } catch (err) {
    logger.error(`Failed to connect to RabbitMQ: ${err}`);
    process.exit(1);
  }
});

['SIGINT', 'SIGTERM'].forEach(signal =>
  process.on(signal, async () => {
    logger.info(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info('Server closed.');
      process.exit(0);
    });
  })
);

// Optional: Handle unexpected crashes
process.on('unhandledRejection', reason => {
  logger.error(`Unhandled Rejection: ${reason}`);
});

process.on('uncaughtException', err => {
  logger.error(`Uncaught Exception: ${err}`);
  process.exit(1);
});

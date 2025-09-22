import { PrismaClient } from '@prisma/client';
import logger from './utils/logger';

const prisma = new PrismaClient({
  log: ['error'],
});

async function connectPrisma() {
  try {
    await prisma.$connect();
    logger.info('Connected to MySQL database via Prisma');
  } catch (error) {
    logger.error(`Failed to connect to MySQL database: ${error}`);
    process.exit(1);
  }
}

async function disconnectPrisma() {
  try {
    await prisma.$disconnect();
    logger.info('Disconnected from MySQL database via Prisma');
  } catch (error) {
    logger.error(`Error disconnecting Prisma: ${error}`);
  }
}

export { prisma, connectPrisma, disconnectPrisma };

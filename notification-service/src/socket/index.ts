import { Server } from 'socket.io';
import logger from '../utils/logger';

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  io.on('connection', socket => {
    logger.info(`User connected: ${socket.id}`);

    socket.on('register', (userId: string) => {
      socket.join(userId);
      logger.info(`User ${userId} joined their private room`);
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized yet!');
  }
  return io;
};

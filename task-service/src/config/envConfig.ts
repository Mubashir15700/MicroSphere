import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3003;
export const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/taskDB_test'
    : process.env.MONGO_URI || 'mongodb://mongo:27017/taskDB';
export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';
export const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3002';

// RabbitMQ
export const TASK_QUEUE_NAME = process.env.TASK_QUEUE_NAME || 'taskQueue';
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';
export const RABBITMQ_RETRY_COUNT = parseInt(process.env.RABBITMQ_RETRY_COUNT || '5');
export const RABBITMQ_RETRY_DELAY = parseInt(process.env.RABBITMQ_RETRY_DELAY || '5000');

// Redis
export const REDIS_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.REDIS_URL_TEST || 'redis://localhost:6379'
    : process.env.REDIS_URL || 'redis://redis:6379';
export const REDIS_CACHE_TTL = parseInt(process.env.REDIS_CACHE_TTL || '3600');

export const SWAGGER_SERVER_URL = process.env.SWAGGER_SERVER_URL || `http://localhost:${PORT}`;

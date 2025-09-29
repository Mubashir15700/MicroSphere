import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';
export const SERVICE_SECRET = process.env.SERVICE_SECRET || 'auth-secret';
export const USER_SERVICE_SECRET = process.env.USER_SERVICE_SECRET || 'user-secret';
export const INTERNAL_AUTH = process.env.INTERNAL_AUTH || 'internal-auth';
export const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3002';

// RabbitMQ
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';
export const USER_QUEUE_NAME = process.env.USER_QUEUE_NAME || 'userQueue';
export const RABBITMQ_RETRY_COUNT = parseInt(process.env.RABBITMQ_RETRY_COUNT || '5');
export const RABBITMQ_RETRY_DELAY = parseInt(process.env.RABBITMQ_RETRY_DELAY || '5000');

export const SWAGGER_SERVER_URL = process.env.SWAGGER_SERVER_URL || 'http://localhost:3000/auth';

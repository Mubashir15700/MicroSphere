import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3003;
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/taskDB';
export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';
export const TASK_QUEUE_NAME = process.env.TASK_QUEUE_NAME || 'taskQueue';
export const RABBITMQ_RETRY_COUNT = parseInt(process.env.RABBITMQ_RETRY_COUNT || '5');
export const RABBITMQ_RETRY_DELAY = parseInt(process.env.RABBITMQ_RETRY_DELAY || '5000');

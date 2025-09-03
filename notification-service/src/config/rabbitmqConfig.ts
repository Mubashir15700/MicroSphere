import dotenv from 'dotenv';
dotenv.config();

export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';
export const QUEUE_NAMES = process.env.QUEUE_NAMES?.split(',').map(name => name.trim()) || [
  'taskQueue',
  'userQueue',
];
export const RETRY_COUNT = parseInt(process.env.RETRY_COUNT || '10');
export const RETRY_DELAY = parseInt(process.env.RETRY_DELAY || '5000');

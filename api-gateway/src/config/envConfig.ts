import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

// Proxy routes URLs
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
export const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3002';
export const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || 'http://task-service:3003';
export const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3004';

// Service secrets
export const AUTH_SERVICE_SECRET = process.env.AUTH_SERVICE_SECRET || 'auth-secret';
export const USER_SERVICE_SECRET = process.env.USER_SERVICE_SECRET || 'user-secret';
export const TASK_SERVICE_SECRET = process.env.TASK_SERVICE_SECRET || 'task-secret';
export const NOTIFICATION_SERVICE_SECRET =
  process.env.NOTIFICATION_SERVICE_SECRET || 'notification-secret';

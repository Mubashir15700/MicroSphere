import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

// Proxy routes URLs
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
export const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3002';
export const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || 'http://task-service:3003';

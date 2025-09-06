import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3002;
export const MONGO_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/userDB_test'
    : process.env.MONGO_URI || 'mongodb://mongo:27017/userDB';

export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';
export const SHARED_SECRET = process.env.SHARED_SECRET || 'shared_secret_key';

export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || '12345@Qw',
};

// Redis
export const REDIS_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.REDIS_URL_TEST || 'redis://localhost:6379'
    : process.env.REDIS_URL || 'redis://redis:6379';
export const REDIS_CACHE_TTL = parseInt(process.env.REDIS_CACHE_TTL || '3600');

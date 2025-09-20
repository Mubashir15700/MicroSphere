import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3004;

export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

export const REDIS_URL =
  process.env.NODE_ENV === 'test'
    ? process.env.REDIS_URL_TEST || 'redis://localhost:6379'
    : process.env.REDIS_URL || 'redis://redis:6379';
export const REDIS_CACHE_TTL = parseInt(process.env.REDIS_CACHE_TTL || '3600');

export const SWAGGER_SERVER_URL = process.env.SWAGGER_SERVER_URL || `http://localhost:${PORT}`;

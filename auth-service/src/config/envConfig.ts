import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3001;
export const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';
export const SHARED_SECRET = process.env.SHARED_SECRET || 'shared_secret_key';
export const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3002';

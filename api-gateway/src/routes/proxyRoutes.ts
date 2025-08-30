import { Router, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../middlewares/authMiddleware';
import { logger } from '../utils/logger';

const router = Router();

const errorHandler = (service: string) => ({
  error: (err: any, _req: any, res: any) => {
    logger.error(`${service} proxy error:`, err.message);
    (res as Response).status(500).json({ message: `${service} proxy error` });
  },
});

// Auth service (no auth required)
router.use(
  '/auth',
  createProxyMiddleware({
    target: 'http://auth-service:3001',
    changeOrigin: true,
    proxyTimeout: 5000,
    pathRewrite: {
      '^/auth': '',
    },
    on: errorHandler('Auth service'),
  })
);

// User service (auth required)
router.use(
  '/users',
  verifyToken,
  createProxyMiddleware({
    target: 'http://user-service:3002',
    changeOrigin: true,
    proxyTimeout: 5000,
    pathRewrite: {
      '^/users': '',
    },
    on: errorHandler('User service'),
  })
);

// Task service (auth required)
router.use(
  '/tasks',
  verifyToken,
  createProxyMiddleware({
    target: 'http://task-service:3003',
    changeOrigin: true,
    proxyTimeout: 5000,
    pathRewrite: {
      '^/tasks': '',
    },
    on: errorHandler('Task service'),
  })
);

export default router;

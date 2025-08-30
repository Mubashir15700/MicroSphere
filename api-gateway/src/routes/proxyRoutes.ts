import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// Auth service (no auth required)
router.use(
  '/auth',
  createProxyMiddleware({
    target: 'http://auth-service:3001',
    changeOrigin: true,
  })
);

// User service (auth required)
router.use(
  '/users',
  verifyToken,
  createProxyMiddleware({
    target: 'http://user-service:3002',
    changeOrigin: true,
  })
);

// Task service (auth required)
router.use(
  '/tasks',
  verifyToken,
  createProxyMiddleware({
    target: 'http://task-service:3003',
    changeOrigin: true,
  })
);

export default router;

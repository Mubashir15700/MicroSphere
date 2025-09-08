import { Router, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import verifyToken from '../middlewares/authMiddleware';
import { AUTH_SERVICE_URL, USER_SERVICE_URL, TASK_SERVICE_URL } from '../config/envConfig';
import logger from '../utils/logger';

const router = Router();

const errorHandler = (service: string) => ({
  error: (err: any, _req: any, res: any) => {
    logger.error(`${service} proxy error: ${err.message}`);
    (res as Response).status(500).json({ message: `${service} proxy error` });
  },
});

const targetRoutes = [
  {
    path: '/auth',
    target: AUTH_SERVICE_URL,
    authRequired: false,
    name: 'Auth service',
  },
  {
    path: '/users',
    target: USER_SERVICE_URL,
    authRequired: true,
    name: 'User service',
  },
  {
    path: '/tasks',
    target: TASK_SERVICE_URL,
    authRequired: true,
    name: 'Task service',
  },
];

targetRoutes.forEach(route => {
  const middlewares = [];

  if (route.authRequired) {
    middlewares.push(verifyToken);
  }

  middlewares.push(
    createProxyMiddleware({
      target: route.target,
      changeOrigin: true,
      proxyTimeout: 5000,
      pathRewrite: {
        [`^${route.path}`]: '',
      },
      on: errorHandler(route.name),
    })
  );

  router.use(route.path, ...middlewares);
});

export default router;

import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import verifyToken from '../middlewares/authMiddleware';
import {
  AUTH_SERVICE_URL,
  USER_SERVICE_URL,
  TASK_SERVICE_URL,
  NOTIFICATION_SERVICE_URL,
  AUTH_SERVICE_SECRET,
  USER_SERVICE_SECRET,
  TASK_SERVICE_SECRET,
  NOTIFICATION_SERVICE_SECRET,
} from '../config/envConfig';
import logger from '../utils/logger';

const router = Router();

const targetRoutes = [
  {
    path: '/auth',
    target: AUTH_SERVICE_URL,
    authRequired: false,
    name: 'Auth service',
    secret: AUTH_SERVICE_SECRET,
  },
  {
    path: '/users',
    target: USER_SERVICE_URL,
    authRequired: true,
    name: 'User service',
    secret: USER_SERVICE_SECRET,
  },
  {
    path: '/tasks',
    target: TASK_SERVICE_URL,
    authRequired: true,
    name: 'Task service',
    secret: TASK_SERVICE_SECRET,
  },
  {
    path: '/notifications',
    target: NOTIFICATION_SERVICE_URL,
    authRequired: true,
    name: 'Notification service',
    secret: NOTIFICATION_SERVICE_SECRET,
  },
];

targetRoutes.forEach(route => {
  // Proxy for swagger docs WITHOUT auth middleware (optional)
  router.use(
    `${route.path}/api-docs`,
    createProxyMiddleware({
      target: route.target,
      changeOrigin: true,
      proxyTimeout: 5000,
      pathRewrite: {
        [`^${route.path}/api-docs`]: '/api-docs', // rewrite to /api-docs on target
      },
      on: {
        error: (err, req, res: any) => {
          logger.error(`${route.name} Swagger proxy error: ${err.message}`);
          if (res && !res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: `${route.name} Swagger proxy error` }));
          }
        },
      },
    })
  );

  // Main proxy with (optional) auth middleware
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
      on: {
        proxyReq: (proxyReq, _req, _res) => {
          proxyReq.setHeader('x-service-secret', route.secret);
        },
        error: (err, req, res: any) => {
          logger.error(`${route.name} proxy error: ${err.message}`);
          if (res && !res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: `${route.name} proxy error` }));
          }
        },
      },
    })
  );

  router.use(route.path, ...middlewares);
});

export default router;

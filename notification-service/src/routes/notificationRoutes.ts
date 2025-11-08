import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { getAllNotifications, updateNotifications } from '../controllers/notificationController';

const router = Router();

router.get('/', verifyToken, getAllNotifications);
router.put('/', verifyToken, updateNotifications);

export default router;

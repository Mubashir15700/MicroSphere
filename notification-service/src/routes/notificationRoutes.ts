import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { getAllNotifications, updateNotification } from '../controllers/notificationController';

const router = Router();

router.get('/', verifyToken, getAllNotifications);
router.put('/:id', verifyToken, updateNotification);

export default router;

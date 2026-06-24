import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';
import { validate } from '../middleware/validate';
import { idParamSchema, listQuerySchema } from '../validators/common';
import { createNotificationSchema } from '../validators/resourceValidators';

const router = Router();

router.get('/', validate({ query: listQuerySchema }), notificationController.list);
router.post('/', validate({ body: createNotificationSchema }), notificationController.create);
router.post('/read-all', notificationController.markAllRead);
router.patch('/:id/read', validate({ params: idParamSchema }), notificationController.markRead);
router.delete('/:id', validate({ params: idParamSchema }), notificationController.remove);

export default router;

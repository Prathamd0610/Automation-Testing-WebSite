import { Router } from 'express';
import { healthController } from '../controllers/healthController';

const router = Router();

router.get('/health', healthController.health);
router.get('/metrics', healthController.metrics);

export default router;

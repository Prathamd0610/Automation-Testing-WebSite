import { Router } from 'express';
import { testDataController } from '../controllers/testDataController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { generatorLimiter } from '../middleware/rateLimiters';
import { generateTestDataSchema } from '../validators/resourceValidators';

const router = Router();

// Bulk generation is admin-only to prevent abuse on public deployments.
router.post(
  '/generate',
  authenticate,
  authorize('admin'),
  generatorLimiter,
  validate({ body: generateTestDataSchema }),
  testDataController.generate,
);

export default router;

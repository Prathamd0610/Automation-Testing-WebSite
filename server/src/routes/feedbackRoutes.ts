import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { idParamSchema, listQuerySchema } from '../validators/common';
import {
  createFeedbackSchema,
  updateFeedbackStatusSchema,
} from '../validators/feedbackValidators';
import * as feedback from '../controllers/feedbackController';

const router = Router();

// Any signed-in user can submit feedback.
router.post('/', authenticate, validate({ body: createFeedbackSchema }), feedback.createFeedback);

// Admin-only: review and triage feedback.
router.get(
  '/',
  authenticate,
  authorize('admin'),
  validate({ query: listQuerySchema }),
  feedback.listFeedback,
);
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  validate({ params: idParamSchema, body: updateFeedbackStatusSchema }),
  feedback.updateFeedbackStatus,
);

export default router;

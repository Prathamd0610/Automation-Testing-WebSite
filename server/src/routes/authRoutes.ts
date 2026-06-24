import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { authenticate, optionalAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiters';
import { loginSchema, registerSchema } from '../validators/authValidators';

const router = Router();

router.post('/register', authLimiter, validate({ body: registerSchema }), authController.register);
router.post('/login', authLimiter, validate({ body: loginSchema }), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', optionalAuth, authController.logout);
router.get('/me', authenticate, authController.me);

export default router;

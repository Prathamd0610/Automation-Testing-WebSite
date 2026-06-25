import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { transferSchema } from '../validators/accountValidators';
import * as account from '../controllers/accountController';

const router = Router();

// All account routes require a signed-in user (any role).
router.use(authenticate);

router.get('/', account.getMyAccount);
router.get('/transactions', account.getMyTransactions);
router.post('/transfer', validate({ body: transferSchema }), account.transfer);

export default router;

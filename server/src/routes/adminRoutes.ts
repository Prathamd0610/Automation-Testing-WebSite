import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { idParamSchema, listQuerySchema } from '../validators/common';
import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
} from '../validators/resourceValidators';
import {
  changeRoleSchema,
  setActiveSchema,
  adjustAccountSchema,
  resetPasswordSchema,
  broadcastSchema,
} from '../validators/adminValidators';
import * as admin from '../controllers/adminController';

const router = Router();

// Every admin route requires a valid token AND the admin role.
router.use(authenticate, authorize('admin'));

// Dashboard
router.get('/stats', admin.getStats);

// User management
router.get('/users', validate({ query: listQuerySchema }), admin.listUsers);
router.post('/users', validate({ body: adminCreateUserSchema }), admin.createUser);
router.patch(
  '/users/:id',
  validate({ params: idParamSchema, body: adminUpdateUserSchema }),
  admin.updateUser,
);
router.patch(
  '/users/:id/role',
  validate({ params: idParamSchema, body: changeRoleSchema }),
  admin.changeRole,
);
router.patch(
  '/users/:id/active',
  validate({ params: idParamSchema, body: setActiveSchema }),
  admin.setActive,
);
router.post(
  '/users/:id/revoke-sessions',
  validate({ params: idParamSchema }),
  admin.revokeSessions,
);
router.post(
  '/users/:id/reset-password',
  validate({ params: idParamSchema, body: resetPasswordSchema }),
  admin.resetPassword,
);
router.delete('/users/:id', validate({ params: idParamSchema }), admin.deleteUser);

// Accounts & transactions
router.get('/accounts', validate({ query: listQuerySchema }), admin.listAccounts);
router.get('/users/:id/account', validate({ params: idParamSchema }), admin.getUserAccount);
router.post(
  '/users/:id/account/adjust',
  validate({ params: idParamSchema, body: adjustAccountSchema }),
  admin.adjustAccount,
);
router.get('/transactions', validate({ query: listQuerySchema }), admin.listTransactions);

// Audit log
router.get('/audit-logs', validate({ query: listQuerySchema }), admin.listAuditLogs);

// Broadcast notification
router.post('/notifications/broadcast', validate({ body: broadcastSchema }), admin.broadcast);

export default router;

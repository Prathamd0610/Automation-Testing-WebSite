import { Router } from 'express';
import authRoutes from './authRoutes';
import healthRoutes from './healthRoutes';
import playgroundRoutes from './playgroundRoutes';
import fileRoutes from './fileRoutes';
import notificationRoutes from './notificationRoutes';
import testDataRoutes from './testDataRoutes';
import adminRoutes from './adminRoutes';
import accountRoutes from './accountRoutes';
import { buildCrudRouter } from './buildCrudRouter';
import { createCrudController } from '../controllers/crudControllerFactory';
import { authenticate, authorize } from '../middleware/auth';
import {
  productService,
  customerService,
  employeeService,
  taskService,
  orderService,
  userService,
} from '../services/resourceServices';
import {
  createProductSchema,
  updateProductSchema,
  createCustomerSchema,
  updateCustomerSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
  createTaskSchema,
  updateTaskSchema,
  createOrderSchema,
  updateOrderSchema,
  adminCreateUserSchema,
  adminUpdateUserSchema,
} from '../validators/resourceValidators';

const router = Router();

// ── Platform endpoints ───────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/notifications', notificationRoutes);
router.use('/files', fileRoutes);
router.use('/playground', playgroundRoutes);
router.use('/admin/test-data', testDataRoutes);
router.use('/admin', adminRoutes);
router.use('/account', accountRoutes);

// ── Public practice CRUD resources (writes are sandboxed + rate-limited) ──────
router.use(
  '/products',
  buildCrudRouter({
    controller: createCrudController(productService),
    createSchema: createProductSchema,
    updateSchema: updateProductSchema,
  }),
);
router.use(
  '/customers',
  buildCrudRouter({
    controller: createCrudController(customerService),
    createSchema: createCustomerSchema,
    updateSchema: updateCustomerSchema,
  }),
);
router.use(
  '/employees',
  buildCrudRouter({
    controller: createCrudController(employeeService),
    createSchema: createEmployeeSchema,
    updateSchema: updateEmployeeSchema,
  }),
);
router.use(
  '/tasks',
  buildCrudRouter({
    controller: createCrudController(taskService),
    createSchema: createTaskSchema,
    updateSchema: updateTaskSchema,
  }),
);
router.use(
  '/orders',
  buildCrudRouter({
    controller: createCrudController(orderService),
    createSchema: createOrderSchema,
    updateSchema: updateOrderSchema,
  }),
);

// ── Admin-only user management (sensitive data) ──────────────────────────────
const usersRouter = Router();
usersRouter.use(authenticate, authorize('admin'));
usersRouter.use(
  buildCrudRouter({
    controller: createCrudController(userService),
    createSchema: adminCreateUserSchema,
    updateSchema: adminUpdateUserSchema,
  }),
);
router.use('/users', usersRouter);

// ── Health + metrics mounted at the API root ─────────────────────────────────
router.use('/', healthRoutes);

export default router;

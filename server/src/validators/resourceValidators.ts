import { z } from 'zod';

// ── Products ─────────────────────────────────────────────────────────────────
export const createProductSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z.string().min(2).max(180).optional(),
  sku: z.string().min(3).max(40),
  description: z.string().max(2000).optional(),
  category: z.string().min(2).max(80),
  price: z.number().nonnegative(),
  currency: z.string().length(3).optional(),
  stock: z.number().int().nonnegative().optional(),
  rating: z.number().min(0).max(5).optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});
export const updateProductSchema = createProductSchema.partial();

// ── Customers ────────────────────────────────────────────────────────────────
export const createCustomerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
  company: z.string().max(160).optional(),
  status: z.enum(['active', 'inactive', 'lead']).optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
  notes: z.string().max(2000).optional(),
});
export const updateCustomerSchema = createCustomerSchema.partial();

// ── Employees ────────────────────────────────────────────────────────────────
export const createEmployeeSchema = z.object({
  employeeId: z.string().min(3).max(40),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email(),
  department: z.string().min(2).max(80),
  position: z.string().min(2).max(120),
  salary: z.number().nonnegative(),
  status: z.enum(['active', 'on_leave', 'terminated']).optional(),
  hireDate: z.coerce.date(),
  managerName: z.string().max(120).optional(),
});
export const updateEmployeeSchema = createEmployeeSchema.partial();

// ── Tasks ────────────────────────────────────────────────────────────────────
export const createTaskSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().max(2000).optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignee: z.string().max(120).optional(),
  order: z.number().int().optional(),
  dueDate: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
});
export const updateTaskSchema = createTaskSchema.partial();

// ── Orders ───────────────────────────────────────────────────────────────────
export const createOrderSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email(),
  items: z
    .array(
      z.object({
        product: z.string().regex(/^[0-9a-fA-F]{24}$/),
        name: z.string().min(1),
        price: z.number().nonnegative(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  paymentMethod: z.string().max(40).optional(),
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']).optional(),
});
export const updateOrderSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentMethod: z.string().max(40).optional(),
});

// ── Notifications ────────────────────────────────────────────────────────────
export const createNotificationSchema = z.object({
  title: z.string().min(1).max(160),
  message: z.string().min(1).max(1000),
  type: z.enum(['info', 'success', 'warning', 'error']).optional(),
  recipient: z.string().email().optional(),
});

// ── Test data generation ─────────────────────────────────────────────────────
export const generateTestDataSchema = z.object({
  kind: z.enum(['users', 'products', 'orders', 'employees', 'customers']),
  count: z.number().int().positive().max(200).default(10),
});

// ── Users (admin management) ─────────────────────────────────────────────────
export const adminCreateUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(['user', 'admin']).optional(),
  isActive: z.boolean().optional(),
});
export const adminUpdateUserSchema = z
  .object({
    name: z.string().min(2).max(80),
    role: z.enum(['user', 'admin']),
    isActive: z.boolean(),
  })
  .partial();

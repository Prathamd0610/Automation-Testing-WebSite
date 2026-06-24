import { CrudService } from './CrudService';
import {
  productRepository,
  customerRepository,
  employeeRepository,
  taskRepository,
  orderRepository,
  notificationRepository,
  userRepository,
} from '../repositories';
import type { IProduct } from '../models/Product';
import type { ICustomer } from '../models/Customer';
import type { IEmployee } from '../models/Employee';
import type { ITask } from '../models/Task';
import type { IOrder } from '../models/Order';
import type { INotification } from '../models/Notification';
import type { IUser } from '../models/User';

export const productService = new CrudService<IProduct>(productRepository, 'Product', {
  searchableFields: ['name', 'description', 'category', 'sku'],
  filterableFields: ['category', 'isActive', 'currency'],
});

export const customerService = new CrudService<ICustomer>(customerRepository, 'Customer', {
  searchableFields: ['name', 'email', 'company'],
  filterableFields: ['status'],
});

export const employeeService = new CrudService<IEmployee>(employeeRepository, 'Employee', {
  searchableFields: ['firstName', 'lastName', 'email', 'department', 'position', 'employeeId'],
  filterableFields: ['department', 'status'],
});

export const taskService = new CrudService<ITask>(taskRepository, 'Task', {
  searchableFields: ['title', 'description', 'assignee'],
  filterableFields: ['status', 'priority'],
  defaultSort: 'order',
});

export const orderService = new CrudService<IOrder>(orderRepository, 'Order', {
  searchableFields: ['orderNumber', 'customerName', 'customerEmail'],
  filterableFields: ['status', 'paymentMethod'],
});

export const notificationService = new CrudService<INotification>(
  notificationRepository,
  'Notification',
  {
    searchableFields: ['title', 'message'],
    filterableFields: ['type', 'read', 'recipient'],
  },
);

export const userService = new CrudService<IUser>(userRepository, 'User', {
  searchableFields: ['name', 'email'],
  filterableFields: ['role', 'isActive'],
});

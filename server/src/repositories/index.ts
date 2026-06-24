import { Product, type IProduct } from '../models/Product';
import { Order, type IOrder } from '../models/Order';
import { Customer, type ICustomer } from '../models/Customer';
import { Employee, type IEmployee } from '../models/Employee';
import { Task, type ITask } from '../models/Task';
import { Notification, type INotification } from '../models/Notification';
import { FileMeta, type IFileMeta } from '../models/FileMeta';
import { AuditLog, type IAuditLog } from '../models/AuditLog';
import { TestData, type ITestData } from '../models/TestData';
import { BaseRepository } from './BaseRepository';

export { userRepository } from './UserRepository';

export const productRepository = new BaseRepository<IProduct>(Product);
export const orderRepository = new BaseRepository<IOrder>(Order);
export const customerRepository = new BaseRepository<ICustomer>(Customer);
export const employeeRepository = new BaseRepository<IEmployee>(Employee);
export const taskRepository = new BaseRepository<ITask>(Task);
export const notificationRepository = new BaseRepository<INotification>(Notification);
export const fileRepository = new BaseRepository<IFileMeta>(FileMeta);
export const auditLogRepository = new BaseRepository<IAuditLog>(AuditLog);
export const testDataRepository = new BaseRepository<ITestData>(TestData);

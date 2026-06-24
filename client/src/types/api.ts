export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  message: string;
  details?: Record<string, string[] | string>;
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  rating: number;
  images: string[];
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export type CustomerStatus = 'active' | 'inactive' | 'lead';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: CustomerStatus;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type EmployeeStatus = 'active' | 'on_leave' | 'terminated';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  status: EmployeeStatus;
  hireDate: string;
  managerName?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  order: number;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  recipient?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileMeta {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy?: string;
  createdAt: string;
}

export interface ListParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

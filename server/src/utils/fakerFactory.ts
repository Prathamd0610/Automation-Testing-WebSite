import { faker } from '@faker-js/faker';
import type { IProduct } from '../models/Product';
import type { ICustomer } from '../models/Customer';
import type { IEmployee } from '../models/Employee';
import type { IOrder, IOrderItem } from '../models/Order';

const PRODUCT_CATEGORIES = [
  'Electronics',
  'Apparel',
  'Home',
  'Books',
  'Toys',
  'Sports',
  'Beauty',
  'Grocery',
];

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'Finance', 'HR', 'Support', 'Operations'];

export function buildFakeUser(): { name: string; email: string; password: string; role: 'user' } {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: 'Password123!',
    role: 'user',
  };
}

export function buildFakeProduct(): Partial<IProduct> {
  const name = faker.commerce.productName();
  return {
    name,
    slug: faker.helpers.slugify(name).toLowerCase(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(PRODUCT_CATEGORIES),
    price: Number(faker.commerce.price({ min: 5, max: 2000 })),
    currency: 'USD',
    stock: faker.number.int({ min: 0, max: 500 }),
    rating: Number(faker.number.float({ min: 1, max: 5, fractionDigits: 1 })),
    images: [faker.image.urlLoremFlickr({ category: 'product' })],
    tags: faker.helpers.arrayElements(['new', 'sale', 'popular', 'limited', 'eco'], { min: 0, max: 3 }),
    isActive: faker.datatype.boolean(0.85),
  };
}

export function buildFakeCustomer(): Partial<ICustomer> {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number(),
    company: faker.company.name(),
    status: faker.helpers.arrayElement(['active', 'inactive', 'lead']),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zip: faker.location.zipCode(),
    },
    notes: faker.lorem.sentence(),
  };
}

export function buildFakeEmployee(): Partial<IEmployee> {
  return {
    employeeId: `EMP-${faker.string.numeric(6)}`,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    department: faker.helpers.arrayElement(DEPARTMENTS),
    position: faker.person.jobTitle(),
    salary: faker.number.int({ min: 40000, max: 220000 }),
    status: faker.helpers.arrayElement(['active', 'on_leave', 'terminated']),
    hireDate: faker.date.past({ years: 10 }),
    managerName: faker.person.fullName(),
  };
}

export function buildFakeOrder(): Partial<IOrder> {
  const itemCount = faker.number.int({ min: 1, max: 4 });
  const items: IOrderItem[] = Array.from({ length: itemCount }, () => ({
    product: faker.database.mongodbObjectId() as unknown as IOrderItem['product'],
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price({ min: 5, max: 500 })),
    quantity: faker.number.int({ min: 1, max: 5 }),
  }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  return {
    orderNumber: `ORD-${faker.string.numeric(8)}`,
    customerName: faker.person.fullName(),
    customerEmail: faker.internet.email().toLowerCase(),
    items,
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    total: Number((subtotal + tax).toFixed(2)),
    status: faker.helpers.arrayElement(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
    paymentMethod: faker.helpers.arrayElement(['card', 'paypal', 'bank_transfer']),
  };
}

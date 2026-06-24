import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

const productPayload = {
  name: 'Test Widget',
  sku: 'tw-1001',
  category: 'Gadgets',
  price: 19.99,
  description: 'A widget for testing.',
};

function createProduct(overrides: Record<string, unknown> = {}) {
  return request(app)
    .post('/api/products')
    .send({ ...productPayload, ...overrides });
}

describe('Product CRUD routes', () => {
  it('creates a product, exposes a string id and normalizes the SKU', async () => {
    const res = await createProduct();

    expect(res.status).toBe(201);
    expect(res.body.data.id).toEqual(expect.any(String));
    expect(res.body.data._id).toBeUndefined();
    expect(res.body.data.name).toBe(productPayload.name);
    expect(res.body.data.sku).toBe('TW-1001');
  });

  it('rejects an invalid product payload with 400', async () => {
    const res = await request(app).post('/api/products').send({ name: 'X' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('lists products with pagination metadata', async () => {
    await createProduct({ sku: 'tw-1' });
    await createProduct({ sku: 'tw-2' });

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    expect(res.body.meta).toMatchObject({
      page: expect.any(Number),
      limit: expect.any(Number),
      total: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  it('supports full-text search filtering', async () => {
    await createProduct({ sku: 'tw-search', name: 'Findable Gizmo' });
    await createProduct({ sku: 'tw-other', name: 'Unrelated Thing' });

    const res = await request(app).get('/api/products').query({ search: 'Findable' });

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.some((p: { name: string }) => p.name === 'Findable Gizmo')).toBe(true);
  });

  it('fetches a single product by id', async () => {
    const created = await createProduct();
    const id = created.body.data.id as string;

    const res = await request(app).get(`/api/products/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
  });

  it('returns 404 for a well-formed but missing id', async () => {
    const res = await request(app).get('/api/products/64b7f1f1f1f1f1f1f1f1f1f1');
    expect(res.status).toBe(404);
  });

  it('returns 400 for a malformed id', async () => {
    const res = await request(app).get('/api/products/not-an-id');
    expect(res.status).toBe(400);
  });

  it('updates a product', async () => {
    const created = await createProduct();
    const id = created.body.data.id as string;

    const res = await request(app).put(`/api/products/${id}`).send({ price: 49.5, stock: 7 });

    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(49.5);
    expect(res.body.data.stock).toBe(7);
  });

  it('deletes a product', async () => {
    const created = await createProduct();
    const id = created.body.data.id as string;

    const del = await request(app).delete(`/api/products/${id}`);
    expect(del.status).toBe(200);

    const after = await request(app).get(`/api/products/${id}`);
    expect(after.status).toBe(404);
  });
});

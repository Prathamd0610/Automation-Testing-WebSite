import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('Playground routes', () => {
  it('echoes GET requests with method and query', async () => {
    const res = await request(app).get('/api/playground/echo').query({ foo: 'bar' });

    expect(res.status).toBe(200);
    expect(res.body.data.method).toBe('GET');
    expect(res.body.data.query).toMatchObject({ foo: 'bar' });
  });

  it('echoes POST requests with the body and a 201 status', async () => {
    const res = await request(app).post('/api/playground/echo').send({ hello: 'world' });

    expect(res.status).toBe(201);
    expect(res.body.data.method).toBe('POST');
    expect(res.body.data.body).toMatchObject({ hello: 'world' });
  });

  it('returns the requested HTTP status code', async () => {
    const res = await request(app).get('/api/playground/status/418');

    expect(res.status).toBe(418);
    expect(res.body.status).toBe(418);
  });

  it('rejects an out-of-range status code with 400', async () => {
    const res = await request(app).get('/api/playground/status/999999');
    expect(res.status).toBe(400);
  });

  it('delays the response by the requested milliseconds', async () => {
    const start = Date.now();
    const res = await request(app).get('/api/playground/delay/120');

    expect(res.status).toBe(200);
    expect(res.body.delayedMs).toBe(120);
    expect(Date.now() - start).toBeGreaterThanOrEqual(100);
  });

  it('fails then succeeds to exercise retry logic via /flaky', async () => {
    const key = `jest-${Date.now()}`;

    const first = await request(app).get('/api/playground/flaky').query({ key, threshold: 2 });
    expect(first.status).toBe(503);
    expect(first.body.success).toBe(false);

    const second = await request(app).get('/api/playground/flaky').query({ key, threshold: 2 });
    expect(second.status).toBe(200);
    expect(second.body.success).toBe(true);
  });
});

import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('Health & metrics routes', () => {
  it('GET /api/health reports an ok status when the database is connected', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ success: true, status: 'ok', database: 'connected' });
    expect(typeof res.body.uptimeSeconds).toBe('number');
    expect(typeof res.body.timestamp).toBe('string');
  });

  it('GET /api/metrics returns a process/request snapshot', async () => {
    const res = await request(app).get('/api/metrics');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it('responds with a structured 404 for unknown routes', async () => {
    const res = await request(app).get('/api/not-a-real-route');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

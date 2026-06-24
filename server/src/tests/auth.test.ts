import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

const credentials = {
  name: 'Test Tester',
  email: 'tester@example.com',
  password: 'Password123',
};

describe('Auth routes', () => {
  it('registers a new user and returns a sanitized profile + access token', async () => {
    const res = await request(app).post('/api/auth/register').send(credentials);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toEqual(expect.any(String));
    expect(res.body.data.user).toMatchObject({ email: credentials.email, name: credentials.name });
    expect(res.body.data.user.id).toEqual(expect.any(String));
    // Sensitive fields must never leave the server.
    expect(res.body.data.user.password).toBeUndefined();
    expect(res.body.data.user.refreshTokenHash).toBeUndefined();
    expect(res.body.data.user._id).toBeUndefined();
    // httpOnly auth cookies are issued.
    const cookies = res.headers['set-cookie'] as unknown as string[];
    expect(cookies.join(';')).toMatch(/accessToken/);
    expect(cookies.join(';')).toMatch(/refreshToken/);
  });

  it('rejects duplicate registrations with 409', async () => {
    await request(app).post('/api/auth/register').send(credentials);
    const res = await request(app).post('/api/auth/register').send(credentials);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('validates the registration payload', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'A', email: 'not-an-email', password: 'weak' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('logs in with valid credentials', async () => {
    await request(app).post('/api/auth/register').send(credentials);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: credentials.password });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toEqual(expect.any(String));
    expect(res.body.data.user.email).toBe(credentials.email);
  });

  it('rejects a login with a wrong password', async () => {
    await request(app).post('/api/auth/register').send(credentials);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'WrongPassword1' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('requires authentication for GET /api/auth/me', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('returns the current profile for a bearer token', async () => {
    const registered = await request(app).post('/api/auth/register').send(credentials);
    const token = registered.body.data.accessToken as string;

    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(credentials.email);
    expect(res.body.data.id).toEqual(expect.any(String));
  });

  it('rotates tokens via the refresh cookie', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/register').send(credentials);

    const res = await agent.post('/api/auth/refresh').send();

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toEqual(expect.any(String));
    expect(res.body.data.user.email).toBe(credentials.email);
  });

  it('clears the session on logout', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/register').send(credentials);

    const res = await agent.post('/api/auth/logout').send();

    expect(res.status).toBe(200);
    // After logout the refresh token is revoked, so a refresh must fail.
    const refresh = await agent.post('/api/auth/refresh').send();
    expect(refresh.status).toBe(401);
  });
});

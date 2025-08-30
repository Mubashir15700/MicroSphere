import request from 'supertest';
import nock from 'nock';
import app from '../src/app';
import jwt from 'jsonwebtoken';

describe('API Gateway', () => {
  let token: string;
  const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

  const testUser = {
    id: 'user123',
    name: 'John Doe',
    email: 'test@example.com',
    password: 'password123',
  };

  afterEach(() => {
    nock.cleanAll(); // Clean all mocks between tests
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });

  it('should proxy /auth/login to auth service', async () => {
    token = jwt.sign({ id: testUser.id, email: testUser.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Mock the auth service response
    nock('http://auth-service:3001').post('/login').reply(200, { token });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe(token);
  });

  it('should reject /users route without token', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Authorization header missing');
  });

  it('should allow /users route with valid token', async () => {
    // Mock the downstream service that /users proxies to
    nock('http://user-service:3002')
      .get('/')
      .reply(200, [{ id: testUser.id, name: testUser.name }]);

    const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: testUser.id, name: testUser.name }]);
  });

  it('should fetch a user by email with valid token', async () => {
    // Mock the downstream User Service request
    nock('http://user-service:3002')
      .get(`/email/${encodeURIComponent(testUser.email)}`)
      .reply(200, {
        id: testUser.id,
        name: testUser.name,
        email: testUser.email,
      });

    const res = await request(app)
      .get(`/users/email/${encodeURIComponent(testUser.email)}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: testUser.id,
      name: testUser.name,
      email: testUser.email,
    });
  });
});

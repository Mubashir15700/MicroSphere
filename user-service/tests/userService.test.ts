import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import User from '../src/models/userModel';
import { MONGO_URI, SHARED_SECRET } from '../src/config/envConfig';

describe('User Service', () => {
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'securepass123',
  };

  let token: string;
  let userId: string;

  beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
  });

  beforeEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/')
        .set('x-service-secret', SHARED_SECRET)
        .send(testUser);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe(testUser.email);
    });

    it('should fail to create user with existing email', async () => {
      await request(app).post('/').set('x-service-secret', SHARED_SECRET).send(testUser);
      const res = await request(app)
        .post('/')
        .set('x-service-secret', SHARED_SECRET)
        .send(testUser);
      expect(res.status).toBe(400);
    });
  });

  describe('GET /email/:email', () => {
    it('should return user by email', async () => {
      await request(app).post('/').set('x-service-secret', SHARED_SECRET).send(testUser);
      const res = await request(app)
        .get(`/email/${testUser.email}`)
        .set('x-service-secret', SHARED_SECRET);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(testUser.email);
    });

    it('should return 404 if user not found', async () => {
      const res = await request(app)
        .get('/email/unknown@example.com')
        .set('x-service-secret', SHARED_SECRET);
      expect(res.status).toBe(404);
    });
  });

  describe('GET / (all users, protected)', () => {
    beforeEach(async () => {
      const user = await request(app).post('/').send(testUser);
      userId = user.body.id;
      // simulate token signing (should match your JWT secret)
      token = jwt.sign(
        { id: userId, email: testUser.email, role: 'admin' },
        process.env.JWT_SECRET || 'jwt_secret_key',
        { expiresIn: '1h' }
      );
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/').set('x-service-secret', SHARED_SECRET);
      expect(res.status).toBe(401);
    });

    it('should return all users with token', async () => {
      const res = await request(app).get('/').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /:id (protected)', () => {
    beforeEach(async () => {
      const user = await request(app)
        .post('/')
        .set('Authorization', `Bearer ${token}`)
        .send(testUser);
      userId = user.body.id;
      token = jwt.sign(
        { id: userId, email: testUser.email },
        process.env.JWT_SECRET || 'jwt_secret_key',
        { expiresIn: '1h' }
      );
    });

    it('should return user by ID', async () => {
      const res = await request(app)
        .get(`/userId/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(testUser.email);
    });

    it('should return 404 if user not found', async () => {
      const invalidId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/${invalidId}`).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get(`/userId/${userId}`);
      expect(res.status).toBe(401);
    });
  });
});

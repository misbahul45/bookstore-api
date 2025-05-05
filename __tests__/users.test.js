import request from 'supertest';
import app from '../src/server.js';
import { setupTestDB, envConfig } from './utils.js';

describe('UsersController API', () => {
  setupTestDB();

  let userId;

  const userData = {
    username: 'misbahul',
    email: 'misbahulmu756@gmail.com',
    password: 'test123',
    role: 'user',
  };

  it('should fail to create a user without authorization', async () => {
    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(401);

    expect(response.body.status).toBe(401);
  });

  it('should create a new user with valid token', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${envConfig.AUTH_API_KEY}`)
      .send(userData)
      .expect(201);

    expect(response.body.message).toMatch(/success/i);
  });

  it('should get list of users', async () => {
    const response = await request(app)
      .get('/api/users?page=1&limit=10')
      .set('Authorization', `Bearer ${envConfig.AUTH_API_KEY}`)
      .expect(200);

    expect(response.body.data.data.length).toBeGreaterThan(0);
    userId = response.body.data.data[0].id;
  });

  it('should get a user by ID', async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${envConfig.AUTH_API_KEY}`)
      .expect(200);

    expect(response.body.data.id).toBe(userId);
  });

  it('should update a user by ID', async () => {
    const updatedData = {
      username: 'misbahulUpdated',
      email: 'updated@gmail.com',
      password: 'newpass123',
      role: 'user',
    };

    await request(app)
      .patch(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${envConfig.AUTH_API_KEY}`)
      .send(updatedData)
      .expect(204);
  });

  it('should delete a user by ID', async () => {
    await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${envConfig.AUTH_API_KEY}`)
      .expect(204);
  });
});

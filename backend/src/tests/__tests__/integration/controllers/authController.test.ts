import mongoose from 'mongoose';
import { createTestUser, generateTestToken, clearTestDatabase } from '../../../utils/testUtils';
import { startTestServer, stopTestServer, getTestClient } from '../../../utils/testServer';

let testApp: any;
let testServer: any;
let testClient: any;

describe('Auth Controller', () => {
  let testUser: any;
  let testToken: string;

  beforeAll(async () => {
    const { app, server } = await startTestServer();
    testApp = app;
    testServer = server;
    testClient = getTestClient(testApp);
  });

  afterAll(async () => {
    // Close the test server and database connections
    await stopTestServer();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clear the database between tests
    await clearTestDatabase();
  });

  beforeEach(async () => {
    // Create a test user with a known ID that matches our mock
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const testUserId = new mongoose.Types.ObjectId('5f8d0f3d4a7c3e1b2c9d8e7f'); // Fixed ObjectId
    testUser = await createTestUser({
      _id: testUserId,
      email: uniqueEmail,
      password: 'password123',
      role: 'staff',
    });
    // Use the mock token that the test setup expects
    testToken = 'validToken';
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'newpassword123',
      };

      const response = await testClient
        .post('/api/auth/register')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(newUser.email.toLowerCase());
      expect(response.body.user.role).toBe('staff'); // Default role for new users
      expect(response.body.user).not.toHaveProperty('passwordHash');
    });

    it('should make first user an admin', async () => {
      // Clear the database to simulate first user
      if (mongoose.connection.db) {
        await mongoose.connection.db.dropDatabase();
      }

      const adminUser = {
        name: 'First User',
        email: 'admin@example.com',
        password: 'admin123',
      };

      const response = await testClient.post('/api/auth/register').send(adminUser).expect(201);

      expect(response.body.user.role).toBe('admin');
    });

    it('should return 400 for duplicate email', async () => {
      // Create a user with the same email as testUser
      const duplicateUser = {
        name: 'Duplicate User',
        email: testUser.email, // Use the test user's email
        password: 'password123',
      };

      const response = await testClient.post('/api/auth/register').send(duplicateUser).expect(400);

      expect(response.body.message).toContain('User already exists with this email');
    });

    it('should validate input data', async () => {
      const invalidUser = {
        name: '',
        email: 'invalid-email',
        password: 'short',
      };

      const response = await testClient.post('/api/auth/register').send(invalidUser).expect(400);

      // Check for specific validation errors
      expect(response.body.message).toBeDefined();
      expect([
        'Name is required',
        'Invalid email address',
        'Password must be at least 6 characters',
      ]).toContain(response.body.message);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const credentials = {
        email: testUser.email, // Use the dynamically created test user's email
        password: 'password123',
      };

      const response = await testClient.post('/api/auth/login').send(credentials).expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(credentials.email);
      expect(response.body.user).not.toHaveProperty('passwordHash');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await testClient
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      // Use the mock token that the test setup expects
      const response = await testClient
        .get('/api/auth/me')
        .set('Authorization', 'Bearer validToken')
        .expect(200);

      // The response should include the user details without the password hash
      expect(response.body).toMatchObject({
        id: '5f8d0f3d4a7c3e1b2c9d8e7f', // The ObjectId we set in the test
        email: testUser.email,
        role: 'staff',
      });
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('should return 401 without token', async () => {
      await testClient.get('/api/auth/me').expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await testClient.get('/api/auth/me').set('Authorization', 'Bearer invalid-token').expect(401);
    });
  });
});

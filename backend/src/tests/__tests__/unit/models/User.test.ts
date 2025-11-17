// src/tests/__tests__/unit/models/User.test.ts
import mongoose from 'mongoose';
import { IUser } from '../../../../models/User';
import { createTestUser, IUserWithMethods } from '../../../utils/testUtils';
import { jest } from '@jest/globals';

describe('User Model', () => {
  beforeAll(async () => {
    // Ensure we're connected to the test database
    if (!mongoose.connection.db) {
      await mongoose.connect(global.__MONGO_URI__);
    }
  });

  afterEach(async () => {
    // Safely drop the database if connection exists
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('User Creation', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'admin' as const,
      };

      const user = await createTestUser(userData);

      expect(user._id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      // Password should be hashed
      expect(user.passwordHash).toBeDefined();
      expect(user.passwordHash).not.toBe(userData.password);
    });

    it('should require email and password', async () => {
      const User = mongoose.model('User');
      const user = new User({ name: 'Test User' });

      let error: mongoose.Error.ValidationError | null = null;
      try {
        await user.validate();
      } catch (err) {
        error = err as mongoose.Error.ValidationError;
      }

      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error?.errors.email).toBeDefined();
      expect(error?.errors.passwordHash).toBeDefined(); // Changed from password to passwordHash
    });

    // ... rest of the test cases
  });

  // ... rest of the test suites
});

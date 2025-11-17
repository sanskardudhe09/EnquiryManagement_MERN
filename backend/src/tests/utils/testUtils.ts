/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/tests/utils/testUtils.ts
import mongoose, { Types, Document, SaveOptions, Model } from 'mongoose';
import { Collection } from 'mongodb';
import { IUser } from '../../models/User';
import { IEnquiry } from '../../models/Enquiry';
import { UserModel, EnquiryModel } from './getModels';

// Create a type that combines IUser with Document methods
type UserDocument = IUser & Document;

// Extend the IUser interface to include methods
export interface IUserWithMethods
  extends Omit<UserDocument, 'comparePassword' | 'generateAuthToken' | 'passwordHash'> {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  save(options?: SaveOptions): Promise<IUserWithMethods>;
  toObject(): any;
  passwordHash: string; // Make this required to match IUser
}

// TestUser type for creating test data
type TestUser = Partial<
  Omit<
    IUser,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'passwordHash'
    | '_id'
    | 'comparePassword'
    | 'generateAuthToken'
  >
> & {
  _id?: Types.ObjectId;
  id?: string;
  password: string;
  role: 'admin' | 'staff';
  passwordHash?: string;
};

// TestEnquiry type for creating test data
type TestEnquiry = Partial<Omit<IEnquiry, 'id' | 'createdAt' | 'updatedAt' | '_id'>> & {
  _id?: Types.ObjectId;
  id?: string;
  assignedTo?: Types.ObjectId | string;
};

export const createTestUser = async (
  userData: Partial<TestUser> = {}
): Promise<IUserWithMethods> => {
  // Create a plain object with only the fields we want to set
  const defaultUser: TestUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    role: 'admin',
    ...userData,
  };

  // Create a new user document
  const user = new UserModel({
    ...defaultUser,
    // Ensure password is hashed by the pre-save hook
    passwordHash: defaultUser.password, // This will be hashed by the pre-save hook
  });

  await user.save();
  return user as unknown as IUserWithMethods; // Type assertion to handle the conversion
};

/**
 * Create a test enquiry in the database
 * @param enquiryData Optional data to override default test enquiry
 * @param assignedTo Optional user ID to assign the enquiry to
 * @returns The created enquiry document
 */
export const createTestEnquiry = async (
  enquiryData: Partial<TestEnquiry> = {},
  assignedTo?: Types.ObjectId | string
): Promise<IEnquiry> => {
  const defaultEnquiry: TestEnquiry = {
    customerName: 'Test Customer',
    email: `test-${Date.now()}@example.com`,
    phone: '+1234567890',
    message: 'This is a test enquiry message',
    status: 'new',
    ...enquiryData,
  };

  if (assignedTo) {
    defaultEnquiry.assignedTo = new Types.ObjectId(assignedTo);
  }

  const enquiry = new EnquiryModel(defaultEnquiry);
  await enquiry.save();
  return enquiry;
};

import jwt from 'jsonwebtoken';

/**
 * Generate a valid JWT token for testing
 * @param userId User ID to include in the token
 * @param role User role (default: 'staff')
 * @returns A valid JWT token
 */
export const generateTestToken = (userId: string, role: 'admin' | 'staff' = 'staff'): string => {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  return jwt.sign(
    {
      id: userId,
      email: 'test@example.com',
      role: role,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Get test request headers with authentication
 * @param token Optional JWT token (will generate one if not provided)
 * @returns Headers object with Authorization
 */
export const getAuthHeaders = (token?: string) => {
  const authToken = token || generateTestToken(new Types.ObjectId().toString());
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  };
};

/**
 * Clears all collections in the test database
 * This should be called between tests to ensure a clean state
 */
export const clearTestDatabase = async (): Promise<void> => {
  if (!mongoose.connection.db) {
    return;
  }

  try {
    const collections = await mongoose.connection.db.collections();

    // Clear each collection
    await Promise.all(
      collections.map(async (collection: Collection) => {
        try {
          await collection.deleteMany({});
        } catch (error) {
          console.error(`Error clearing collection ${collection.collectionName}:`, error);
        }
      })
    );
  } catch (error) {
    console.error('Error clearing test database:', error);
    throw error;
  }
};

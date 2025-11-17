/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import type { Jest } from '@jest/environment';

declare global {
  var __MONGO_URI__: string;
  var __MONGO_INSTANCE: MongoMemoryServer;
}

jest.setTimeout(30000);

jest.mock('jsonwebtoken', () => {
  const actual = jest.requireActual('jsonwebtoken') as Record<string, unknown>;
  return {
    ...actual,
    verify: jest.fn((token: string) => {
      if (token === 'validToken') {
        return {
          id: '5f8d0f3d4a7c3e1b2c9d8e7f',
          role: 'staff',
        };
      }
      throw new Error('Invalid token');
    }),
    sign: jest.fn(() => 'mockedToken'),
  };
});

let mongoServer: MongoMemoryServer;
import { beforeAll, afterAll, afterEach } from '@jest/globals';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGO_URI = mongoUri;
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    try {
      await collection.deleteMany({});
    } catch (error) {
      console.error(`Error clearing collection ${key}:`, error);
    }
  }
});

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/tests/utils/testServer.ts
import { Server } from 'http';
import request, { Test } from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { createApp } from '../../../src/app';

type TestAgent = ReturnType<typeof request.agent>;

let mongoServer: MongoMemoryServer;
let app: ReturnType<typeof createApp>;
let server: Server;
let isConnected = false;

/**
 * Start the test server with an in-memory MongoDB instance
 */
export const startTestServer = async () => {
  // If already connected, just return the existing server
  if (isConnected) {
    return { app, server, mongoUri: mongoServer?.getUri() || '' };
  }

  try {
    // Create in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory database if not already connected
    if (mongoose.connection.readyState === 0) {
      // 0 = disconnected
      await mongoose.connect(mongoUri);
    }

    // Create Express app
    app = createApp();

    // Start the server on a random port
    return new Promise<{
      app: typeof app;
      server: Server;
      mongoUri: string;
    }>(resolve => {
      server = app.listen(0, () => {
        isConnected = true;
        resolve({
          app,
          server,
          mongoUri,
        });
      });
    });
  } catch (error) {
    console.error('Error starting test server:', error);
    throw error;
  }
};

/**
 * Stop the test server and close database connections
 */
export const stopTestServer = async (): Promise<void> => {
  try {
    // Close the server if it exists
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close(err => {
          if (err) reject(err);
          else resolve();
        });
      });
      server = null as any;
    }

    // Close MongoDB connection if connected
    if (mongoose.connection.readyState !== 0) {
      // 0 = disconnected
      await mongoose.disconnect();
    }

    // Stop the in-memory MongoDB server if it exists
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null as any;
    }

    isConnected = false;
  } catch (error) {
    console.error('Error stopping test server:', error);
    throw error;
  }
};

/**
 * Get a test client for making authenticated requests
 * @param app Express app instance
 * @param token Optional JWT token for authentication
 * @returns Test agent with base URL and auth headers set
 */
export const getTestClient = (app: ReturnType<typeof createApp>, token?: string): TestAgent => {
  const client = request.agent(app);

  // Set default headers
  client.set('Accept', 'application/json');

  // Add auth header if token is provided
  if (token) {
    client.set('Authorization', `Bearer ${token}`);
  }

  return client;
};

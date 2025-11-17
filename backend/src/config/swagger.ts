// backend/src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';

const packageJsonPath = path.resolve(__dirname, '../../package.json');
const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enquiry Management API',
      version,
      description: 'API documentation for Enquiry Management System',
    },
    servers: [
      {
        url: 'https://enquirymanagement-backend.onrender.com/api',
        description: 'Production server',
      },
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Enquiry: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: {
              type: 'string',
              enum: ['open', 'in_progress', 'resolved', 'closed'],
              default: 'open',
            },
            createdBy: { $ref: '#/components/schemas/User' },
            assignedTo: { $ref: '#/components/schemas/User' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
    './dist/routes/*.js',
    './dist/controllers/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;

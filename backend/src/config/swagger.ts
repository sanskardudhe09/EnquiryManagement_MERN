import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

const apiPaths = isProd
  ? [path.join(__dirname, '../routes/*.js'), path.join(__dirname, '../controllers/*.js')]
  : [path.join(__dirname, '../routes/*.ts'), path.join(__dirname, '../controllers/*.ts')];

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enquiry Management API',
      version: '1.0.0',
      description: 'API documentation for Enquiry Management System',
    },
    servers: [{ url: '/api', description: 'Current Server' }],
  },
  apis: apiPaths,
};

export default swaggerJsdoc(options);

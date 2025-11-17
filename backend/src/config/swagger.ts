import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const apiPaths = [
  path.join(__dirname, '../routes/*.{ts,js}'),
  path.join(__dirname, '../controllers/*.{ts,js}'),
];

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Enquiry Management API',
      version: '1.0.0',
      description: 'API documentation for Enquiry Management System',
    },
    servers: [
      { url: '/', description: 'Current Server' }, // leave '/' so it works on Render URL
    ],
  },
  apis: apiPaths,
};

let swaggerSpec: any;

try {
  swaggerSpec = swaggerJsdoc(options);

  console.log('🔥 Swagger generated successfully!');
  console.log('📌 Total paths found:', Object.keys(swaggerSpec.paths || {}).length);
  console.log('📌 Scanning files:', apiPaths);

  if (!swaggerSpec.paths || Object.keys(swaggerSpec.paths).length === 0) {
    console.warn('⚠ No Swagger paths detected! Check your JSDoc comments.');
  }
} catch (err) {
  console.error('❌ SWAGGER GENERATION FAILED:', err);
  throw err;
}

export default swaggerSpec;

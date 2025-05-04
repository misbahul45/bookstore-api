// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BoockstoreApp API',
      version: '1.0.0',
      description: 'Documentation for BoockstoreApp API',
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./docs/*.js'], // Lokasi file dengan JSDoc untuk dokumentasi endpoint
});

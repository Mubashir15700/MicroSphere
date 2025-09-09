import swaggerJSDoc from 'swagger-jsdoc';
import { SWAGGER_SERVER_URL } from '../config/envConfig';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Service API',
      version: '1.0.0',
      description: 'API documentation for the user service',
    },
    servers: [
      {
        url: SWAGGER_SERVER_URL,
      },
    ],
  },
  apis: ['./src/docs/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;

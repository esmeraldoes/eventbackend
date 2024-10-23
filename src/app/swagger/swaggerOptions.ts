import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Events API',
      version: '1.0.0',
      description: 'API documentation for the events managementapplication',
      contact: {
        name: 'Victor',
        url: 'https://yourwebsite.com',
        email: '',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1', 
      },
    ],
  },
  apis: ['./src/app/modules/**/*.route.ts'], 
};

export default swaggerJsDoc(swaggerOptions);


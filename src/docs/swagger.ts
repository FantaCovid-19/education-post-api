import SwaggerJSDoc, { OAS3Definition } from 'swagger-jsdoc';

const swaggerDefinition: OAS3Definition = {
  openapi: '3.1.0',
  info: {
    title: 'API Documentation',
    description: 'API Documentation',
    termsOfService: 'https://mrfantasma.com/terms',
    contact: {
      name: 'Mr.Fantasma | API Support',
      url: 'https://mrfantasma.com',
      email: 'contact@mrfantasma.com'
    },
    license: {
      name: 'GNU GPL V3',
      url: 'https://opensource.org/license/gpl-3-0/'
    },
    version: '1.6.0'
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        description: 'JWT authorization of an API',
        name: 'Authorization',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  schemes: ['https', 'http']
};

const options = {
  swaggerDefinition,
  apis: ['src/docs/**/*.yaml']
};

export const swaggerJSDoc = SwaggerJSDoc(options);

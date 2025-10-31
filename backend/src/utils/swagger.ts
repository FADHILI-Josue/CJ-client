import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { logger } from './logger';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Credit Jambo Savings API',
            version: '1.0.0',
            description: 'API documentation for the Savings Management System',
        },
        servers: [{ url: 'http://localhost:5001/api' }], // Change port accordingly
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    logger.info('Swagger docs available at /api-docs');
};
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DNA Trust Mark API',
            version: '1.0.0',
            description: 'API documentation for the DNA Trust Mark certification system.',
            contact: {
                name: 'ADNGUARD Team',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Local Development Server',
            },
            {
                url: 'https://api.dna-trust-mark.com/api',
                description: 'Production Server',
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
                Establishment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        type: { type: 'string', enum: ['boucherie', 'restaurant', 'usine', 'traiteur', 'autre'] },
                        address: { type: 'string' },
                        city: { type: 'string' },
                        postalCode: { type: 'string' },
                        phone: { type: 'string' },
                        email: { type: 'string' },
                        siret: { type: 'string' },
                        adnguardCode: { type: 'string' },
                        status: { type: 'string', enum: ['en_attente', 'conforme', 'non_conforme', 'suspendu'] },
                        certifiedSince: { type: 'string', format: 'date-time' },
                        lastControlDate: { type: 'string', format: 'date-time' },
                    }
                },
                Control: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        establishmentId: { type: 'string', format: 'uuid' },
                        controlDate: { type: 'string', format: 'date-time' },
                        inspectorId: { type: 'string', format: 'uuid' },
                        result: { type: 'string', enum: ['conforme', 'non_conforme'] },
                        reportId: { type: 'string' },
                        anomaliesDetected: { type: 'string' },
                        actionRequired: { type: 'string' },
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

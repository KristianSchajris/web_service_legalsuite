import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Legal Suite API',
      version: '1.0.0',
      description: 'API para el sistema de gestión legal',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
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
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Nombre de usuario',
              example: 'admin',
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario',
              example: 'password123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT de acceso',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'ID único del usuario (UUID)',
                },
                username: {
                  type: 'string',
                  description: 'Nombre de usuario',
                },
                role: {
                  type: 'string',
                  description: 'Rol del usuario',
                  enum: ['admin', 'lawyer', 'client'],
                },
              },
            },
          },
        },
        Lawyer: {
          type: 'object',
          required: ['name', 'email', 'specialization'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único del abogado (UUID)',
            },
            name: {
              type: 'string',
              description: 'Nombre completo del abogado',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del abogado',
            },
            specialization: {
              type: 'string',
              description: 'Especialización del abogado',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Estado del abogado',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
            },
          },
        },
        LawyerInput: {
          type: 'object',
          required: ['name', 'email', 'phone', 'specialization'],
          properties: {
            name: {
              type: 'string',
              description: 'Nombre completo del abogado',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico del abogado',
            },
            phone: {
              type: 'string',
              description: 'Número de teléfono del abogado',
            },
            specialization: {
              type: 'string',
              description: 'Especialización del abogado',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive'],
              description: 'Estado del abogado',
              default: 'active',
            },
          },
        },
        Lawsuit: {
          type: 'object',
          required: ['caseNumber', 'plaintiff', 'defendant', 'caseType', 'status'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID único de la demanda (UUID)',
            },
            caseNumber: {
              type: 'string',
              description: 'Número de caso único',
            },
            plaintiff: {
              type: 'string',
              description: 'Nombre del demandante',
            },
            defendant: {
              type: 'string',
              description: 'Nombre del demandado',
            },
            caseType: {
              type: 'string',
              enum: ['civil', 'criminal', 'laboral', 'comercial'],
              description: 'Tipo de caso legal',
            },
            status: {
              type: 'string',
              enum: ['pending', 'assigned', 'resolved'],
              description: 'Estado de la demanda',
            },
            lawyerId: {
              type: 'string',
              format: 'uuid',
              description: 'ID del abogado asignado (UUID)',
              nullable: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización',
            },
          },
        },
        LawsuitInput: {
          type: 'object',
          required: ['case_number', 'plaintiff', 'defendant', 'case_type'],
          properties: {
            case_number: {
              type: 'string',
              description: 'Número de caso único',
              example: 'CASE-2024-001',
            },
            plaintiff: {
              type: 'string',
              description: 'Nombre del demandante',
              example: 'Juan Pérez',
            },
            defendant: {
              type: 'string',
              description: 'Nombre del demandado',
              example: 'Empresa ABC',
            },
            case_type: {
              type: 'string',
              enum: ['civil', 'criminal', 'laboral', 'comercial'],
              description: 'Tipo de caso legal',
              example: 'civil',
            },
            status: {
              type: 'string',
              enum: ['pending', 'assigned', 'resolved'],
              description: 'Estado de la demanda',
              default: 'pending',
              example: 'pending',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de error',
            },
            error: {
              type: 'object',
              description: 'Detalles del error',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Operaciones de autenticación y autorización',
      },
      {
        name: 'Lawyers',
        description: 'Operaciones relacionadas con abogados',
      },
      {
        name: 'Demandas',
        description: 'Operaciones relacionadas con demandas',
      },
      {
        name: 'Reportes',
        description: 'Operaciones de reportes y consultas',
      },
    ],
  },
  apis: ['./src/interfaces/routes/*.ts'], // Rutas donde están las anotaciones de Swagger
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
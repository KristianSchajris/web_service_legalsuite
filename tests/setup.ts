// Mock del DI Container para tests
jest.mock('../src/infrastructure/di/DIContainer', () => ({
  DIContainer: {
    getInstance: jest.fn(() => ({
      get: jest.fn(),
      register: jest.fn(),
    })),
  },
}));

// Mock de variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'test_db';
process.env.DB_USER = 'test_user';
process.env.DB_PASS = 'test_pass';

// Configuración global para tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock de console.log para tests más limpios (opcional)
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
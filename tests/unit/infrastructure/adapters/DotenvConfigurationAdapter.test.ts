import { DotenvConfigurationAdapter } from '../../../../src/infrastructure/adapters/DotenvConfigurationAdapter';
import * as dotenv from 'dotenv';

// Mock de dotenv
jest.mock('dotenv');
const mockedDotenv = jest.mocked(dotenv);

describe('DotenvConfigurationAdapter', () => {
  let configAdapter: DotenvConfigurationAdapter;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Resetear variables de entorno
    process.env = { ...originalEnv };
    
    configAdapter = new DotenvConfigurationAdapter();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('initialize', () => {
    it('should call dotenv.config() when initializing for the first time', () => {
      configAdapter.initialize();

      expect(mockedDotenv.config).toHaveBeenCalledTimes(1);
    });

    it('should not call dotenv.config() multiple times', () => {
      configAdapter.initialize();
      configAdapter.initialize();
      configAdapter.initialize();

      expect(mockedDotenv.config).toHaveBeenCalledTimes(1);
    });

    it('should handle dotenv.config() errors gracefully', () => {
      mockedDotenv.config.mockImplementation(() => {
        throw new Error('Dotenv error');
      });

      expect(() => configAdapter.initialize()).toThrow('Dotenv error');
    });
  });

  describe('getPort', () => {
    it('should return port from environment variable when set', () => {
      process.env.PORT = '8080';

      const port = configAdapter.getPort();

      expect(port).toBe(8080);
    });

    it('should return default port 3000 when PORT is not set', () => {
      delete process.env.PORT;

      const port = configAdapter.getPort();

      expect(port).toBe(3000);
    });

    it('should return default port when PORT is empty string', () => {
      process.env.PORT = '';

      const port = configAdapter.getPort();

      expect(port).toBe(3000);
    });

    it('should parse port as integer', () => {
      process.env.PORT = '5000';

      const port = configAdapter.getPort();

      expect(port).toBe(5000);
      expect(typeof port).toBe('number');
    });

    it('should handle invalid port values', () => {
      process.env.PORT = 'invalid';

      const port = configAdapter.getPort();

      expect(isNaN(port)).toBe(true); // parseInt('invalid', 10) returns NaN
    });

    it('should handle floating point port values', () => {
      process.env.PORT = '3000.5';

      const port = configAdapter.getPort();

      expect(port).toBe(3000); // parseInt truncates decimal
    });
  });

  describe('getEnvironment', () => {
    it('should return environment from NODE_ENV when set', () => {
      process.env.NODE_ENV = 'production';

      const environment = configAdapter.getEnvironment();

      expect(environment).toBe('production');
    });

    it('should return default environment "development" when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;

      const environment = configAdapter.getEnvironment();

      expect(environment).toBe('development');
    });

    it('should return environment from NODE_ENV when empty string', () => {
      process.env.NODE_ENV = '';

      const environment = configAdapter.getEnvironment();

      expect(environment).toBe('development'); // || 'development' is used when empty
    });

    it('should handle different environment values', () => {
      const environments = ['development', 'production', 'test', 'staging'];

      environments.forEach(env => {
        process.env.NODE_ENV = env;
        const result = configAdapter.getEnvironment();
        expect(result).toBe(env);
      });
    });

    it('should handle custom environment values', () => {
      process.env.NODE_ENV = 'custom-env';

      const environment = configAdapter.getEnvironment();

      expect(environment).toBe('custom-env');
    });
  });

  describe('integration scenarios', () => {
    it('should work with real environment configuration', () => {
      process.env.PORT = '4000';
      process.env.NODE_ENV = 'test';

      configAdapter.initialize();

      expect(configAdapter.getPort()).toBe(4000);
      expect(configAdapter.getEnvironment()).toBe('test');
      expect(mockedDotenv.config).toHaveBeenCalledTimes(1);
    });

    it('should maintain state between calls', () => {
      // Primera inicialización
      configAdapter.initialize();
      const firstCallCount = mockedDotenv.config.mock.calls.length;

      // Cambiar variables de entorno
      process.env.PORT = '9000';
      process.env.NODE_ENV = 'production';

      // Segunda inicialización
      configAdapter.initialize();
      const secondCallCount = mockedDotenv.config.mock.calls.length;

      // Verificar que dotenv.config() no se llamó de nuevo
      expect(secondCallCount).toBe(firstCallCount);
      
      // Pero los valores actuales deben reflejarse
      expect(configAdapter.getPort()).toBe(9000);
      expect(configAdapter.getEnvironment()).toBe('production');
    });

    it('should handle multiple instances independently', () => {
      const adapter1 = new DotenvConfigurationAdapter();
      const adapter2 = new DotenvConfigurationAdapter();

      adapter1.initialize();
      adapter2.initialize();

      // Cada instancia debe mantener su propio estado de inicialización
      expect(mockedDotenv.config).toHaveBeenCalledTimes(2);
    });
  });
});
import { StructuredConsoleLogger } from '../../../../src/infrastructure/logging/StructuredConsoleLogger';
import { LogEntry } from '../../../../src/domain/interfaces/StructuredLogger';

describe('StructuredConsoleLogger', () => {
  let logger: StructuredConsoleLogger;
  let consoleSpy: {
    log: jest.SpyInstance;
    error: jest.SpyInstance;
    warn: jest.SpyInstance;
    debug: jest.SpyInstance;
  };

  beforeEach(() => {
    logger = new StructuredConsoleLogger('test-service');
    
    // Mock console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      debug: jest.spyOn(console, 'debug').mockImplementation(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Logger interface compatibility', () => {
    it('should log info messages with structured format', () => {
      const message = 'Test info message';
      
      logger.info(message);
      
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      
      expect(loggedData.message).toBe(message);
      expect(loggedData.metadata.log_level).toBe('INFO');
      expect(loggedData.metadata.service_name).toBe('test-service');
      expect(loggedData.metadata.timestamp).toBeDefined();
    });

    it('should log error messages with structured format', () => {
      const message = 'Test error message';
      
      logger.error(message);
      
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleSpy.error.mock.calls[0][0]);
      
      expect(loggedData.message).toBe(message);
      expect(loggedData.metadata.log_level).toBe('ERROR');
      expect(loggedData.metadata.service_name).toBe('test-service');
      expect(loggedData.metadata.timestamp).toBeDefined();
    });

    it('should log warn messages with structured format', () => {
      const message = 'Test warn message';
      
      logger.warn(message);
      
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleSpy.warn.mock.calls[0][0]);
      
      expect(loggedData.message).toBe(message);
      expect(loggedData.metadata.log_level).toBe('WARN');
      expect(loggedData.metadata.service_name).toBe('test-service');
      expect(loggedData.metadata.timestamp).toBeDefined();
    });

    it('should log debug messages with structured format', () => {
      const message = 'Test debug message';
      
      logger.debug(message);
      
      expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleSpy.debug.mock.calls[0][0]);
      
      expect(loggedData.message).toBe(message);
      expect(loggedData.metadata.log_level).toBe('DEBUG');
      expect(loggedData.metadata.service_name).toBe('test-service');
      expect(loggedData.metadata.timestamp).toBeDefined();
    });
  });

  describe('Structured logging', () => {
    it('should log structured entries with JSON format using logStructured method', () => {
      const entry: LogEntry = {
        message: 'Test structured message',
        metadata: {
          timestamp: '2024-01-01T00:00:00.000Z',
          log_level: 'INFO',
          service_name: 'test-service',
          userId: '123',
          action: 'test'
        }
      };

      logger.logStructured(entry);

      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      
      expect(loggedData.message).toBe('Test structured message');
      expect(loggedData.metadata.log_level).toBe('INFO');
      expect(loggedData.metadata.service_name).toBe('test-service');
      expect(loggedData.metadata.userId).toBe('123');
      expect(loggedData.metadata.action).toBe('test');
    });

    it('should handle info messages with structured format', () => {
      const message = 'Info with metadata';

      logger.info(message);

      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      
      expect(loggedData.message).toBe(message);
      expect(loggedData.metadata.log_level).toBe('INFO');
      expect(loggedData.metadata.service_name).toBe('test-service');
      expect(loggedData.metadata.timestamp).toBeDefined();
    });

    it('should handle error messages with structured format', () => {
      const message = 'Error with metadata';

      logger.error(message);

      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
      const loggedData = JSON.parse(consoleSpy.error.mock.calls[0][0]);
      
      expect(loggedData.message).toBe(message);
      expect(loggedData.metadata.log_level).toBe('ERROR');
      expect(loggedData.metadata.service_name).toBe('test-service');
      expect(loggedData.metadata.timestamp).toBeDefined();
    });
  });

  describe('Data sanitization', () => {
    it('should sanitize password fields', () => {
      const sensitiveData = {
        username: 'admin',
        password: 'secret123',
        email: 'admin@test.com'
      };

      const sanitized = logger.sanitizeData(sensitiveData);

      expect(sanitized.username).toBe('admin');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.email).toBe('admin@test.com');
    });

    it('should sanitize token fields', () => {
      const sensitiveData = {
        user: 'admin',
        token: 'jwt-token-123',
        authorization: 'Bearer token123'
      };

      const sanitized = logger.sanitizeData(sensitiveData);

      expect(sanitized.user).toBe('admin');
      expect(sanitized.token).toBe('[REDACTED]');
      expect(sanitized.authorization).toBe('[REDACTED]');
    });

    it('should sanitize nested objects', () => {
      const sensitiveData = {
        user: {
          id: '123',
          password: 'secret',
          profile: {
            name: 'Admin',
            secret: 'hidden'
          }
        }
      };

      const sanitized = logger.sanitizeData(sensitiveData);

      expect(sanitized.user.id).toBe('123');
      expect(sanitized.user.password).toBe('[REDACTED]');
      expect(sanitized.user.profile.name).toBe('Admin');
      expect(sanitized.user.profile.secret).toBe('[REDACTED]');
    });

    it('should handle arrays with sensitive data', () => {
      const sensitiveData = [
        { username: 'user1', password: 'pass1' },
        { username: 'user2', password: 'pass2' }
      ];

      const sanitized = logger.sanitizeData(sensitiveData);

      expect(sanitized[0].username).toBe('user1');
      expect(sanitized[0].password).toBe('[REDACTED]');
      expect(sanitized[1].username).toBe('user2');
      expect(sanitized[1].password).toBe('[REDACTED]');
    });

    it('should handle null and undefined values', () => {
      expect(logger.sanitizeData(null)).toBeNull();
      expect(logger.sanitizeData(undefined)).toBeUndefined();
    });

    it('should not sanitize regular strings', () => {
      const regularString = 'This is a regular message';
      expect(logger.sanitizeData(regularString)).toBe(regularString);
    });
  });

  describe('Structured logging with sanitization', () => {
    it('should sanitize context data in info logs', () => {
      const entry: LogEntry = {
        message: 'Login attempt',
        metadata: {
          timestamp: new Date().toISOString(),
          log_level: 'INFO',
          service_name: 'test-service'
        },
        context: {
          username: 'admin',
          password: 'secret123',
          timestamp: '2024-01-01'
        }
      };

      logger.logStructured(entry);

      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      
      expect(loggedData.context.username).toBe('admin');
      expect(loggedData.context.password).toBe('[REDACTED]');
      expect(loggedData.context.timestamp).toBe('2024-01-01');
    });

    it('should sanitize context data in log entries', () => {
      const entry: LogEntry = {
        message: 'Sensitive data log',
        metadata: {
          timestamp: new Date().toISOString(),
          log_level: 'INFO',
          service_name: 'test-service'
        },
        context: {
          user: 'admin',
          token: 'secret-token',
          data: 'normal-data'
        }
      };

      logger.logStructured(entry);

      const loggedData = JSON.parse(consoleSpy.log.mock.calls[0][0]);
      
      expect(loggedData.context.user).toBe('admin');
      expect(loggedData.context.token).toBe('[REDACTED]');
      expect(loggedData.context.data).toBe('normal-data');
    });
  });
});

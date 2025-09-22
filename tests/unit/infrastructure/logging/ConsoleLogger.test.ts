import { ConsoleLogger } from '../../../../src/infrastructure/logging/ConsoleLogger';

describe('ConsoleLogger', () => {
  let logger: ConsoleLogger;
  let consoleSpy: {
    log: jest.SpyInstance;
    error: jest.SpyInstance;
    warn: jest.SpyInstance;
    debug: jest.SpyInstance;
  };

  beforeEach(() => {
    logger = new ConsoleLogger();
    
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

  describe('info', () => {
    it('should call console.log with formatted message', () => {
      const message = 'Test info message';
      
      logger.info(message);
      
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO] Test info message');
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
    });

    it('should handle empty message', () => {
      logger.info('');
      
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO] ');
    });

    it('should handle additional arguments', () => {
      const message = 'Test message';
      const arg1 = { key: 'value' };
      const arg2 = 123;
      
      logger.info(message, arg1, arg2);
      
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO] Test message', arg1, arg2);
    });

    it('should handle multiline messages', () => {
      const multilineMessage = 'Line 1\nLine 2\nLine 3';
      
      logger.info(multilineMessage);
      
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO] Line 1\nLine 2\nLine 3');
    });
  });

  describe('error', () => {
    it('should call console.error with formatted message', () => {
      const errorMessage = 'Test error message';
      
      logger.error(errorMessage);
      
      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] Test error message');
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });

    it('should handle Error objects message', () => {
      const error = new Error('Test error');
      
      logger.error(error.message);
      
      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] Test error');
    });

    it('should handle empty error message', () => {
      logger.error('');
      
      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] ');
    });

    it('should handle additional arguments', () => {
      const message = 'Database error';
      const errorDetails = { code: 500, table: 'users' };
      
      logger.error(message, errorDetails);
      
      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] Database error', errorDetails);
    });
  });

  describe('warn', () => {
    it('should call console.warn with formatted message', () => {
      const warnMessage = 'Test warning message';
      
      logger.warn(warnMessage);
      
      expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN] Test warning message');
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
    });

    it('should handle deprecation warnings', () => {
      const deprecationWarning = 'Method deprecated: use newMethod() instead';
      
      logger.warn(deprecationWarning);
      
      expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN] Method deprecated: use newMethod() instead');
    });

    it('should handle empty warning message', () => {
      logger.warn('');
      
      expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN] ');
    });

    it('should handle additional arguments', () => {
      const message = 'Performance warning';
      const metrics = { responseTime: 5000, threshold: 2000 };
      
      logger.warn(message, metrics);
      
      expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN] Performance warning', metrics);
    });
  });

  describe('debug', () => {
    it('should call console.debug with formatted message', () => {
      const debugMessage = 'Test debug message';
      
      logger.debug(debugMessage);
      
      expect(consoleSpy.debug).toHaveBeenCalledWith('[DEBUG] Test debug message');
      expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
    });

    it('should handle debug information', () => {
      const debugInfo = 'Variable value: 42';
      
      logger.debug(debugInfo);
      
      expect(consoleSpy.debug).toHaveBeenCalledWith('[DEBUG] Variable value: 42');
    });

    it('should handle empty debug message', () => {
      logger.debug('');
      
      expect(consoleSpy.debug).toHaveBeenCalledWith('[DEBUG] ');
    });

    it('should handle additional arguments', () => {
      const message = 'Debug state';
      const state = { userId: '123', action: 'login' };
      
      logger.debug(message, state);
      
      expect(consoleSpy.debug).toHaveBeenCalledWith('[DEBUG] Debug state', state);
    });
  });

  describe('multiple logging calls', () => {
    it('should handle multiple info calls', () => {
      logger.info('First message');
      logger.info('Second message');
      logger.info('Third message');
      
      expect(consoleSpy.log).toHaveBeenCalledTimes(3);
      expect(consoleSpy.log).toHaveBeenNthCalledWith(1, '[INFO] First message');
      expect(consoleSpy.log).toHaveBeenNthCalledWith(2, '[INFO] Second message');
      expect(consoleSpy.log).toHaveBeenNthCalledWith(3, '[INFO] Third message');
    });

    it('should handle mixed logging levels', () => {
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      logger.debug('Debug message');
      
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO] Info message');
      expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN] Warning message');
      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] Error message');
      expect(consoleSpy.debug).toHaveBeenCalledWith('[DEBUG] Debug message');
    });
  });

  describe('edge cases', () => {
    it('should handle null or undefined messages gracefully', () => {
      // TypeScript would prevent this, but testing runtime behavior
      logger.info(null as any);
      logger.info(undefined as any);
      
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO] null');
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO] undefined');
    });

    it('should handle numeric messages', () => {
      logger.info('123' as string);
      logger.error('404' as string);
      
      expect(consoleSpy.log).toHaveBeenCalledWith('[INFO] 123');
      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] 404');
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(1000);
      
      logger.info(longMessage);
      
      expect(consoleSpy.log).toHaveBeenCalledWith(`[INFO] ${longMessage}`);
    });
  });

  describe('integration scenarios', () => {
    it('should work in a typical application flow', () => {
      // Simulate application startup
      logger.info('Application starting...');
      logger.debug('Loading configuration');
      logger.warn('Using default database settings');
      logger.info('Server ready on port 3000');
      
      // Simulate an error
      logger.error('Database connection failed');
      
      expect(consoleSpy.log).toHaveBeenCalledTimes(2);
      expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });
  });
});
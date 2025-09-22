import { JwtAuthService } from '../../../../src/infrastructure/auth/JwtAuthService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Mock de las librerías externas
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

const mockedJwt = jest.mocked(jwt);
const mockedBcrypt = {
  hash: jest.fn(),
  compare: jest.fn()
};

describe('JwtAuthService', () => {
  let authService: JwtAuthService;
  const originalEnv = process.env;

  beforeEach(() => {
    // Resetear mocks
    jest.clearAllMocks();
    
    // Configurar variables de entorno para testing
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test_secret_key',
      JWT_EXPIRES_IN: '1h'
    };
    
    // Configurar mocks de bcrypt
    (bcrypt.hash as jest.Mock) = mockedBcrypt.hash;
    (bcrypt.compare as jest.Mock) = mockedBcrypt.compare;
    
    authService = new JwtAuthService();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('generateToken', () => {
    it('should generate a token with correct payload', () => {
      const expectedToken = 'generated-jwt-token';
      mockedJwt.sign.mockReturnValue(expectedToken as any);

      const result = authService.generateToken('user123', 'testuser', 'admin');

      expect(mockedJwt.sign).toHaveBeenCalledWith(
        {
          userId: 'user123',
          username: 'testuser',
          role: 'admin'
        },
        'test_secret_key',
        { expiresIn: '1h' }
      );
      expect(result).toBe(expectedToken);
    });

    it('should use default values when environment variables are not set', () => {
      delete process.env.JWT_SECRET;
      delete process.env.JWT_EXPIRES_IN;
      
      const newAuthService = new JwtAuthService();
      const expectedToken = 'generated-jwt-token';
      mockedJwt.sign.mockReturnValue(expectedToken as any);

      const result = newAuthService.generateToken('user123', 'testuser', 'admin');

      expect(mockedJwt.sign).toHaveBeenCalledWith(
        {
          userId: 'user123',
          username: 'testuser',
          role: 'admin'
        },
        'default_secret_key_change_in_production',
        { expiresIn: '24h' }
      );
      expect(result).toBe(expectedToken);
    });

    it('should handle different user roles', () => {
      const expectedToken = 'generated-jwt-token';
      mockedJwt.sign.mockReturnValue(expectedToken as any);

      authService.generateToken('user123', 'operator', 'operator');

      expect(mockedJwt.sign).toHaveBeenCalledWith(
        {
          userId: 'user123',
          username: 'operator',
          role: 'operator'
        },
        'test_secret_key',
        { expiresIn: '1h' }
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify and return decoded token when valid', () => {
      const mockDecoded = {
        userId: 'user123',
        username: 'testuser',
        role: 'admin'
      };
      mockedJwt.verify.mockReturnValue(mockDecoded as any);

      const result = authService.verifyToken('valid-token');

      expect(mockedJwt.verify).toHaveBeenCalledWith('valid-token', 'test_secret_key');
      expect(result).toEqual(mockDecoded);
    });

    it('should return null when token is invalid', () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = authService.verifyToken('invalid-token');

      expect(mockedJwt.verify).toHaveBeenCalledWith('invalid-token', 'test_secret_key');
      expect(result).toBeNull();
    });

    it('should return null when token is expired', () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      const result = authService.verifyToken('expired-token');

      expect(result).toBeNull();
    });

    it('should handle malformed tokens', () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Malformed token');
      });

      const result = authService.verifyToken('malformed-token');

      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('should hash password with correct salt rounds', async () => {
      const password = 'plainPassword123';
      const hashedPassword = 'hashedPassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await authService.hashPassword(password);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should handle empty password', async () => {
      const hashedPassword = 'hashedEmptyPassword';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await authService.hashPassword('');

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('', 10);
      expect(result).toBe(hashedPassword);
    });

    it('should handle bcrypt errors', async () => {
      const error = new Error('Bcrypt error');
      mockedBcrypt.hash.mockRejectedValue(error);

      await expect(authService.hashPassword('password')).rejects.toThrow('Bcrypt error');
    });

    it('should handle special characters in password', async () => {
      const specialPassword = 'p@ssw0rd!#$%';
      const hashedPassword = 'hashedSpecialPassword';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword);

      const result = await authService.hashPassword(specialPassword);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(specialPassword, 10);
      expect(result).toBe(hashedPassword);
    });
  });

  describe('comparePassword', () => {
    it('should return true when passwords match', async () => {
      mockedBcrypt.compare.mockResolvedValue(true);

      const result = await authService.comparePassword('plainPassword', 'hashedPassword');

      expect(mockedBcrypt.compare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
      expect(result).toBe(true);
    });

    it('should return false when passwords do not match', async () => {
      mockedBcrypt.compare.mockResolvedValue(false);

      const result = await authService.comparePassword('wrongPassword', 'hashedPassword');

      expect(mockedBcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
      expect(result).toBe(false);
    });

    it('should handle empty passwords', async () => {
      mockedBcrypt.compare.mockResolvedValue(false);

      const result = await authService.comparePassword('', 'hashedPassword');

      expect(mockedBcrypt.compare).toHaveBeenCalledWith('', 'hashedPassword');
      expect(result).toBe(false);
    });

    it('should handle bcrypt comparison errors', async () => {
      const error = new Error('Bcrypt comparison error');
      mockedBcrypt.compare.mockRejectedValue(error);

      await expect(authService.comparePassword('password', 'hash')).rejects.toThrow('Bcrypt comparison error');
    });

    it('should handle special characters in comparison', async () => {
      const specialPassword = 'p@ssw0rd!#$%';
      const hashedPassword = '$2b$10$hashedSpecialPassword';
      mockedBcrypt.compare.mockResolvedValue(true);

      const result = await authService.comparePassword(specialPassword, hashedPassword);

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(specialPassword, hashedPassword);
      expect(result).toBe(true);
    });
  });

  describe('integration scenarios', () => {
    it('should work with real-world token flow', () => {
      const mockDecoded = {
        userId: 'user123',
        username: 'testuser',
        role: 'admin'
      };
      
      // Mock token generation
      const expectedToken = 'jwt-token-123';
      mockedJwt.sign.mockReturnValue(expectedToken as any);
      
      // Mock token verification
      mockedJwt.verify.mockReturnValue(mockDecoded as any);

      // Generate token
      const token = authService.generateToken('user123', 'testuser', 'admin');
      expect(token).toBe(expectedToken);

      // Verify token
      const decoded = authService.verifyToken(token);
      expect(decoded).toEqual(mockDecoded);
    });

    it('should handle password hashing and comparison flow', async () => {
      const plainPassword = 'mySecretPassword';
      const hashedPassword = '$2b$10$hashedPassword';
      
      // Mock password hashing
      mockedBcrypt.hash.mockResolvedValue(hashedPassword);
      
      // Mock password comparison
      mockedBcrypt.compare.mockResolvedValue(true);

      // Hash password
      const hash = await authService.hashPassword(plainPassword);
      expect(hash).toBe(hashedPassword);

      // Compare password
      const isValid = await authService.comparePassword(plainPassword, hash);
      expect(isValid).toBe(true);
    });
  });
});
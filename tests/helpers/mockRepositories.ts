import { LawyerRepository } from '../../src/domain/repositories/LawyerRepository';
import { LawsuitRepository } from '../../src/domain/repositories/LawsuitRepository';
import { UserRepository } from '../../src/domain/repositories/UserRepository';
import { Lawyer } from '../../src/domain/entities/Lawyer';
import { Lawsuit } from '../../src/domain/entities/Lawsuit';
import { User } from '../../src/domain/entities/User';

// Mock para LawyerRepository
export const createMockLawyerRepository = (): jest.Mocked<LawyerRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

// Mock para LawsuitRepository
export const createMockLawsuitRepository = (): jest.Mocked<LawsuitRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByLawyerId: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

// Mock para UserRepository
export const createMockUserRepository = (): jest.Mocked<UserRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByUsername: jest.fn(),
});

// Mock para AuthService
export const createMockAuthService = () => ({
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
  hashPassword: jest.fn(),
  comparePassword: jest.fn()
});

// Mock para Logger
export const createMockLogger = () => ({
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
});
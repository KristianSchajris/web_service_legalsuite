import { LoginUseCase } from '../../../../src/application/use-cases/auth/LoginUseCase';
import { User, UserRole } from '../../../../src/domain/entities/User';
import { createMockUserRepository, createMockAuthService, createMockLogger } from '../../../helpers/mockRepositories';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockUserRepository: ReturnType<typeof createMockUserRepository>;
  let mockAuthService: ReturnType<typeof createMockAuthService>;
  let mockLogger: ReturnType<typeof createMockLogger>;

  beforeEach(() => {
    mockUserRepository = createMockUserRepository();
    mockAuthService = createMockAuthService();
    mockLogger = createMockLogger();
    useCase = new LoginUseCase(mockUserRepository, mockAuthService, mockLogger);
  });

  describe('execute', () => {
    const validLoginData = {
      username: 'admin',
      password: 'password123'
    };

    const mockUser = new User({
      id: '123',
      username: 'admin',
      password: 'hashedPassword123',
      role: UserRole.ADMIN
    });

    it('should login successfully with valid credentials', async () => {
      const expectedToken = 'jwt-token-123';
      
      mockUserRepository.findByUsername.mockResolvedValue(mockUser);
      mockAuthService.comparePassword.mockResolvedValue(true);
      mockAuthService.generateToken.mockReturnValue(expectedToken);

      const result = await useCase.execute(validLoginData);

      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('admin');
      expect(mockAuthService.comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(mockAuthService.generateToken).toHaveBeenCalledWith('123', 'admin', UserRole.ADMIN);
      
      expect(result).toEqual({
        token: expectedToken,
        user: {
          id: '123',
          username: 'admin',
          role: UserRole.ADMIN
        }
      });
    });

    it('should throw error when username is missing', async () => {
      const invalidData = { username: '', password: 'password123' };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Usuario y contraseña son requeridos');
      
      expect(mockUserRepository.findByUsername).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith('Error: Usuario o contraseña no proporcionados');
    });

    it('should throw error when password is missing', async () => {
      const invalidData = { username: 'admin', password: '' };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Usuario y contraseña son requeridos');
      
      expect(mockUserRepository.findByUsername).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith('Error: Usuario o contraseña no proporcionados');
    });

    it('should throw error when user is not found', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(null);

      await expect(useCase.execute(validLoginData)).rejects.toThrow('Credenciales inválidas');
      
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('admin');
      expect(mockAuthService.comparePassword).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith('Error: Usuario no encontrado');
    });

    it('should throw error when user password is undefined', async () => {
      const userWithoutPassword = new User({
        id: '123',
        username: 'admin',
        password: '',
        role: UserRole.ADMIN
      });
      userWithoutPassword.password = undefined as any;

      mockUserRepository.findByUsername.mockResolvedValue(userWithoutPassword);

      await expect(useCase.execute(validLoginData)).rejects.toThrow('Error en las credenciales');
      
      expect(mockLogger.error).toHaveBeenCalledWith('Error: La contraseña del usuario no está definida en la base de datos');
    });

    it('should throw error when password is incorrect', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(mockUser);
      mockAuthService.comparePassword.mockResolvedValue(false);

      await expect(useCase.execute(validLoginData)).rejects.toThrow('Credenciales inválidas');
      
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('admin');
      expect(mockAuthService.comparePassword).toHaveBeenCalledWith('password123', 'hashedPassword123');
      expect(mockAuthService.generateToken).not.toHaveBeenCalled();
      expect(mockLogger.warn).toHaveBeenCalledWith('Error: Contraseña incorrecta');
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Database connection failed');
      mockUserRepository.findByUsername.mockRejectedValue(repositoryError);

      await expect(useCase.execute(validLoginData)).rejects.toThrow('Database connection failed');
      
      expect(mockLogger.error).toHaveBeenCalledWith('Error durante el proceso de autenticación:', repositoryError);
    });

    it('should handle auth service errors', async () => {
      const authError = new Error('Password comparison failed');
      mockUserRepository.findByUsername.mockResolvedValue(mockUser);
      mockAuthService.comparePassword.mockRejectedValue(authError);

      await expect(useCase.execute(validLoginData)).rejects.toThrow('Password comparison failed');
      
      expect(mockLogger.error).toHaveBeenCalledWith('Error durante el proceso de autenticación:', authError);
    });

    it('should handle unknown errors', async () => {
      mockUserRepository.findByUsername.mockRejectedValue('Unknown error');

      await expect(useCase.execute(validLoginData)).rejects.toThrow('Error en la autenticación');
      
      expect(mockLogger.error).toHaveBeenCalledWith('Error durante el proceso de autenticación:', 'Unknown error');
    });

    it('should log all steps of the process', async () => {
      const expectedToken = 'jwt-token-123';
      
      mockUserRepository.findByUsername.mockResolvedValue(mockUser);
      mockAuthService.comparePassword.mockResolvedValue(true);
      mockAuthService.generateToken.mockReturnValue(expectedToken);

      await useCase.execute(validLoginData);

      expect(mockLogger.info).toHaveBeenCalledWith('Iniciando proceso de login para usuario:', 'admin');
      expect(mockLogger.info).toHaveBeenCalledWith('Buscando usuario en la base de datos...');
      expect(mockLogger.info).toHaveBeenCalledWith('Usuario encontrado:', 'Sí');
      expect(mockLogger.debug).toHaveBeenCalledWith('Comparando contraseñas...');
      // Logs de información sensible removidos por seguridad
      expect(mockLogger.debug).toHaveBeenCalledWith('Resultado de la comparación de contraseñas:', true);
    });
  });
});
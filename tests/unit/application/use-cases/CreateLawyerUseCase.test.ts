import { CreateLawyerUseCase } from '../../../../src/application/use-cases/lawyer/CreateLawyerUseCase';
import { Lawyer, LawyerStatus } from '../../../../src/domain/entities/Lawyer';
import { createMockLawyerRepository } from '../../../helpers/mockRepositories';

describe('CreateLawyerUseCase', () => {
  let useCase: CreateLawyerUseCase;
  let mockRepository: ReturnType<typeof createMockLawyerRepository>;

  beforeEach(() => {
    mockRepository = createMockLawyerRepository();
    useCase = new CreateLawyerUseCase(mockRepository);
  });

  describe('execute', () => {
    const validLawyerData = {
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: '555-1234',
      specialization: 'Civil',
      status: LawyerStatus.ACTIVE
    };

    it('should create a lawyer successfully', async () => {
      const expectedLawyer = new Lawyer({
        id: '123',
        ...validLawyerData
      });

      mockRepository.create.mockResolvedValue(expectedLawyer);

      const result = await useCase.execute(validLawyerData);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: validLawyerData.name,
          email: validLawyerData.email,
          phone: validLawyerData.phone,
          specialization: validLawyerData.specialization,
          status: validLawyerData.status
        })
      );
      expect(result).toEqual(expectedLawyer.toJSON());
    });

    it('should throw error when name is missing', async () => {
      const invalidData = { ...validLawyerData, name: '' };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Faltan campos obligatorios');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when email is missing', async () => {
      const invalidData = { ...validLawyerData, email: '' };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Faltan campos obligatorios');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when phone is missing', async () => {
      const invalidData = { ...validLawyerData, phone: '' };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Faltan campos obligatorios');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when specialization is missing', async () => {
      const invalidData = { ...validLawyerData, specialization: '' };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Faltan campos obligatorios');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when status is invalid', async () => {
      const invalidData = { ...validLawyerData, status: 'invalid_status' as LawyerStatus };

      await expect(useCase.execute(invalidData)).rejects.toThrow('Estado no válido');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should create lawyer with INACTIVE status', async () => {
      const inactiveLawyerData = { ...validLawyerData, status: LawyerStatus.INACTIVE };
      const expectedLawyer = new Lawyer({
        id: '123',
        ...inactiveLawyerData
      });

      mockRepository.create.mockResolvedValue(expectedLawyer);

      const result = await useCase.execute(inactiveLawyerData);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: LawyerStatus.INACTIVE
        })
      );
      expect(result.status).toBe(LawyerStatus.INACTIVE);
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Database connection failed');
      mockRepository.create.mockRejectedValue(repositoryError);

      await expect(useCase.execute(validLawyerData)).rejects.toThrow('Database connection failed');
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should create lawyer entity with correct properties', async () => {
      const expectedLawyer = new Lawyer({
        id: '123',
        ...validLawyerData
      });

      mockRepository.create.mockResolvedValue(expectedLawyer);

      await useCase.execute(validLawyerData);

      const createdLawyerCall = mockRepository.create.mock.calls[0][0];
      expect(createdLawyerCall).toBeInstanceOf(Lawyer);
      expect(createdLawyerCall.name).toBe(validLawyerData.name);
      expect(createdLawyerCall.email).toBe(validLawyerData.email);
      expect(createdLawyerCall.phone).toBe(validLawyerData.phone);
      expect(createdLawyerCall.specialization).toBe(validLawyerData.specialization);
      expect(createdLawyerCall.status).toBe(validLawyerData.status);
    });
  });
});
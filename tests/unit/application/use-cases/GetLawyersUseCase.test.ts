import { GetLawyersUseCase } from '../../../../src/application/use-cases/lawyer/GetLawyersUseCase';
import { Lawyer, LawyerStatus } from '../../../../src/domain/entities/Lawyer';
import { createMockLawyerRepository } from '../../../helpers/mockRepositories';

describe('GetLawyersUseCase', () => {
  let useCase: GetLawyersUseCase;
  let mockLawyerRepository: ReturnType<typeof createMockLawyerRepository>;

  beforeEach(() => {
    mockLawyerRepository = createMockLawyerRepository();
    useCase = new GetLawyersUseCase(mockLawyerRepository);
  });

  describe('execute', () => {
    const mockLawyers = [
      new Lawyer({
        id: '1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '123456789',
        specialization: 'Civil',
        status: LawyerStatus.ACTIVE
      }),
      new Lawyer({
        id: '2',
        name: 'María García',
        email: 'maria@example.com',
        phone: '987654321',
        specialization: 'Penal',
        status: LawyerStatus.ACTIVE
      }),
      new Lawyer({
        id: '3',
        name: 'Carlos López',
        email: 'carlos@example.com',
        phone: '555666777',
        specialization: 'Laboral',
        status: LawyerStatus.INACTIVE
      })
    ];

    it('should return all lawyers successfully', async () => {
      mockLawyerRepository.findAll.mockResolvedValue({ lawyers: mockLawyers, total: 3 });

      const result = await useCase.execute();

      expect(mockLawyerRepository.findAll).toHaveBeenCalledWith(1, 10);
      expect(result.lawyers).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should return empty array when no lawyers exist', async () => {
      mockLawyerRepository.findAll.mockResolvedValue({ lawyers: [], total: 0 });

      const result = await useCase.execute();

      expect(mockLawyerRepository.findAll).toHaveBeenCalledWith(1, 10);
      expect(result.lawyers).toEqual([]);
      expect(result.lawyers).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Database connection failed');
      mockLawyerRepository.findAll.mockRejectedValue(repositoryError);

      await expect(useCase.execute()).rejects.toThrow('Database connection failed');
      
      expect(mockLawyerRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return lawyers with correct properties', async () => {
      const singleLawyer = [mockLawyers[0]];
      mockLawyerRepository.findAll.mockResolvedValue({ lawyers: singleLawyer, total: 1 });

      const result = await useCase.execute();

      expect(result.lawyers[0].id).toBe('1');
      expect(result.lawyers[0].name).toBe('Juan Pérez');
      expect(result.lawyers[0].email).toBe('juan@example.com');
      expect(result.lawyers[0].phone).toBe('123456789');
      expect(result.lawyers[0].specialization).toBe('Civil');
      expect(result.lawyers[0].status).toBe(LawyerStatus.ACTIVE);
    });

    it('should return lawyers with different statuses', async () => {
      mockLawyerRepository.findAll.mockResolvedValue({ lawyers: mockLawyers, total: 3 });

      const result = await useCase.execute();

      const activeLawyers = result.lawyers.filter(lawyer => lawyer.status === LawyerStatus.ACTIVE);
      const inactiveLawyers = result.lawyers.filter(lawyer => lawyer.status === LawyerStatus.INACTIVE);

      expect(activeLawyers).toHaveLength(2);
      expect(inactiveLawyers).toHaveLength(1);
    });

    it('should maintain data integrity', async () => {
      mockLawyerRepository.findAll.mockResolvedValue({ lawyers: mockLawyers, total: 3 });

      const result = await useCase.execute();

      // Verificar que los datos no se modifiquen
      expect(result.lawyers[0].name).toBe(mockLawyers[0].name);
      expect(result.lawyers[1].email).toBe(mockLawyers[1].email);
      expect(result.lawyers[2].specialization).toBe(mockLawyers[2].specialization);
    });

    it('should handle pagination parameters', async () => {
      mockLawyerRepository.findAll.mockResolvedValue({ lawyers: mockLawyers, total: 3 });

      const result = await useCase.execute(2, 5);

      expect(mockLawyerRepository.findAll).toHaveBeenCalledWith(2, 5);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
    });

    it('should use default pagination when not provided', async () => {
      mockLawyerRepository.findAll.mockResolvedValue({ lawyers: mockLawyers, total: 3 });

      const result = await useCase.execute();

      expect(mockLawyerRepository.findAll).toHaveBeenCalledWith(1, 10);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should call repository method exactly once per execution', async () => {
      mockLawyerRepository.findAll.mockResolvedValue({ lawyers: mockLawyers, total: 3 });

      await useCase.execute();
      await useCase.execute();

      expect(mockLawyerRepository.findAll).toHaveBeenCalledTimes(2);
    });
  });
});
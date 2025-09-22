import { LawyerProps } from '../../../domain/entities/Lawyer';
import { LawyerRepository } from '../../../domain/repositories/LawyerRepository';
import { GetLawyersResponse } from '../../interfaces/lawyer/GetLawyersResponse';

export class GetLawyersUseCase {
  constructor(private sequelizeLawyerRepository: LawyerRepository) {}

  async execute(page: number = 1, limit: number = 10): Promise<GetLawyersResponse> {
    const { lawyers, total } = await this.sequelizeLawyerRepository.findAll(page, limit);
    
    return {
      lawyers: lawyers.map(lawyer => lawyer.toJSON()),
      total,
      page,
      limit
    };
  }
}
import { LawsuitProps, LawsuitStatus } from '../../../domain/entities/Lawsuit';
import { LawsuitRepository } from '../../../domain/repositories/LawsuitRepository';
import { GetLawsuitsFilters } from '../../interfaces/lawsuit/GetLawsuitsFilters';
import { GetLawsuitsResponse } from '../../interfaces/lawsuit/GetLawsuitsResponse';

export class GetLawsuitsUseCase {
  constructor(private sequelizeLawsuitRepository: LawsuitRepository) {}

  async execute(filters?: GetLawsuitsFilters, page: number = 1, limit: number = 10): Promise<GetLawsuitsResponse> {
    const { lawsuits, total } = await this.sequelizeLawsuitRepository.findAll(filters, page, limit);
    
    return {
      lawsuits: lawsuits.map(lawsuit => lawsuit.toJSON()),
      total,
      page,
      limit
    };
  }
}
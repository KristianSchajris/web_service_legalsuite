import { LawsuitProps } from '../../../domain/entities/Lawsuit';
import { LawyerRepository } from '../../../domain/repositories/LawyerRepository';
import { LawsuitRepository } from '../../../domain/repositories/LawsuitRepository';
import { LawyerLawsuitsResponse } from '../../interfaces/lawsuit/LawyerLawsuitsResponse';

export class GetLawsuitsByLawyerUseCase {
  constructor(
    private sequelizeLawsuitRepository: LawsuitRepository,
    private sequelizeLawyerRepository: LawyerRepository
  ) {}

  async execute(lawyerId: string): Promise<LawyerLawsuitsResponse> {
    // Validar que exista el abogado
    const lawyer = await this.sequelizeLawyerRepository.findById(lawyerId);
    if (!lawyer) {
      throw new Error('Abogado no encontrado');
    }

    // Obtener demandas del abogado
    const lawsuits = await this.sequelizeLawsuitRepository.findByLawyerId(lawyerId);
    
    return {
      lawyer: {
        id: lawyer.id!,
        name: lawyer.name
      },
      lawsuits: lawsuits.map(lawsuit => ({
        id: lawsuit.id!,
        caseNumber: lawsuit.caseNumber,
        status: lawsuit.status
      }))
    };
  }
}
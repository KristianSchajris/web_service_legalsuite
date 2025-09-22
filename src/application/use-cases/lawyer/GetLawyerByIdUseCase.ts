import { Lawyer } from '../../../domain/entities/Lawyer';
import { LawyerRepository } from '../../../domain/repositories/LawyerRepository';
import { Logger } from '../../../domain/interfaces/Logger';

export class GetLawyerByIdUseCase {
  constructor(
    private sequelizeLawyerRepository: LawyerRepository,
    private logger: Logger
  ) {}

  async execute(id: string): Promise<Lawyer | null> {
    this.logger.info('GetLawyerByIdUseCase - Buscando abogado con ID:', id);
    
    try {
      const lawyer = await this.sequelizeLawyerRepository.findById(id);
      this.logger.info('GetLawyerByIdUseCase - Resultado del repositorio:', lawyer ? 'Abogado encontrado' : 'Abogado no encontrado');
      
      if (!lawyer) {
        return null;
      }
      
      this.logger.debug('GetLawyerByIdUseCase - Abogado a devolver:', JSON.stringify(lawyer, null, 2));
      return lawyer;
    } catch (error: any) {
      this.logger.error('GetLawyerByIdUseCase - Error al buscar abogado:', error);
      throw error;
    }
  }
}

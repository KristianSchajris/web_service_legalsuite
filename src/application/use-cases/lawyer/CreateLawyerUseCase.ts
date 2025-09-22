import { Lawyer, LawyerProps, LawyerStatus } from '../../../domain/entities/Lawyer';
import { LawyerRepository } from '../../../domain/repositories/LawyerRepository';
import { CreateLawyerDTO } from '../../interfaces/lawyer/CreateLawyerDTO';

export class CreateLawyerUseCase {
  constructor(private sequelizeLawyerRepository: LawyerRepository) {}

  async execute(data: CreateLawyerDTO): Promise<LawyerProps> {
    // Validar datos
    if (!data.name || !data.email || !data.phone || !data.specialization) {
      throw new Error('Faltan campos obligatorios');
    }

    // Validar status
    if (data.status !== LawyerStatus.ACTIVE && data.status !== LawyerStatus.INACTIVE) {
      throw new Error('Estado no válido');
    }

    // Crear entidad
    const lawyer = new Lawyer({
      name: data.name,
      email: data.email,
      phone: data.phone,
      specialization: data.specialization,
      status: data.status as LawyerStatus
    });

    // Persistir en repositorio
    const createdLawyer = await this.sequelizeLawyerRepository.create(lawyer);
    
    return createdLawyer.toJSON();
  }
}

import { Lawsuit, LawsuitCaseType, LawsuitProps, LawsuitStatus } from '../../../domain/entities/Lawsuit';
import { LawsuitRepository } from '../../../domain/repositories/LawsuitRepository';
import { CreateLawsuitDTO } from '../../interfaces/lawsuit/CreateLawsuitDTO';

export class CreateLawsuitUseCase {
    constructor(private sequelizeLawsuitRepository: LawsuitRepository) { }

    async execute(data: CreateLawsuitDTO): Promise<LawsuitProps> {
        // Validar datos
        if (!data.caseNumber || !data.plaintiff || !data.defendant || !data.caseType) {
            throw new Error('Faltan campos obligatorios');
        }

        // Validar case type
        if (!Object.values(LawsuitCaseType).includes(data.caseType as LawsuitCaseType)) {
            throw new Error('Tipo de caso no válido');
        }

        // Validar status
        if (!Object.values(LawsuitStatus).includes(data.status as LawsuitStatus)) {
            throw new Error('Estado no válido');
        }

        // Crear entidad
        const lawsuit = new Lawsuit({
            caseNumber: data.caseNumber,
            plaintiff: data.plaintiff,
            defendant: data.defendant,
            caseType: data.caseType as LawsuitCaseType,
            status: data.status as LawsuitStatus
        });

        // Persistir en repositorio
        const createdLawsuit = await this.sequelizeLawsuitRepository.create(lawsuit);

        return createdLawsuit.toJSON();
    }
}

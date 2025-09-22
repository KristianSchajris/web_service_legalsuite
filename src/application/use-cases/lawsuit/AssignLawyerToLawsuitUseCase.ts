import { Lawsuit, LawsuitProps } from '../../../domain/entities/Lawsuit';
import { LawsuitRepository } from '../../../domain/repositories/LawsuitRepository';
import { LawyerRepository } from '../../../domain/repositories/LawyerRepository';
import { LawyerStatus } from '../../../domain/entities/Lawyer';
import { Logger } from '../../../domain/interfaces/Logger';
import { AssignLawyerDTO } from '../../interfaces/lawsuit/AssignLawyerDTO';

export class AssignLawyerToLawsuitUseCase {
    constructor(
        private sequelizeLawsuitRepository: LawsuitRepository,
        private sequelizeLawyerRepository: LawyerRepository,
        private logger: Logger
    ) { }

    async execute(data: AssignLawyerDTO): Promise<LawsuitProps> {
        this.logger.info('Iniciando asignación de abogado a demanda');

        // Validar que el ID de la demanda no esté vacío
        if (!data.lawsuitId) {
            const error = new Error('El ID de la demanda es requerido');
            this.logger.error('Error de validación', error);
            throw error;
        }

        // Validar que el ID del abogado no esté vacío
        if (!data.lawyerId) {
            const error = new Error('El ID del abogado es requerido');
            this.logger.error('Error de validación', error);
            throw error;
        }

        // Validar que exista la demanda
        this.logger.info('Buscando demanda con ID:', data.lawsuitId);
        const lawsuit = await this.sequelizeLawsuitRepository.findById(data.lawsuitId);
        if (!lawsuit) {
            const error = new Error(`No se encontró una demanda con el ID: ${data.lawsuitId}`);
            this.logger.error('Error al buscar demanda', error);
            throw error;
        }
        this.logger.debug('Demanda encontrada con ID:', data.lawsuitId);

        // Validar que exista el abogado
        this.logger.info('Buscando abogado con ID:', data.lawyerId);
        const lawyer = await this.sequelizeLawyerRepository.findById(data.lawyerId);
        if (!lawyer) {
            const error = new Error(`No se encontró un abogado con el ID: ${data.lawyerId}`);
            this.logger.error('Error al buscar abogado', error);
            throw error;
        }
        this.logger.debug('Abogado encontrado con ID:', data.lawyerId);

        // Validar que el abogado esté activo
        if (lawyer.status !== LawyerStatus.ACTIVE) {
            const error = new Error(`El abogado con ID ${data.lawyerId} no está activo (estado actual: ${lawyer.status})`);
            this.logger.error('Error de validación', error);
            throw error;
        }

        try {
            // Asignar abogado a la demanda
            this.logger.info(`Asignando abogado ${data.lawyerId} a la demanda ${data.lawsuitId}`);
            lawsuit.assignLawyer(data.lawyerId);

            // Persistir cambios
            this.logger.info('Actualizando demanda en el repositorio...');
            const updatedLawsuit = await this.sequelizeLawsuitRepository.update(lawsuit);

            this.logger.info('Asignación completada exitosamente');
            return updatedLawsuit.toJSON();
        } catch (error) {
            const errorObj = error instanceof Error ? error : new Error(String(error));
            this.logger.error('Error al asignar abogado', errorObj, {
                lawsuitId: data.lawsuitId,
                lawyerId: data.lawyerId
            });
            throw new Error(`Error al asignar el abogado: ${errorObj.message}`);
        }
    }
}

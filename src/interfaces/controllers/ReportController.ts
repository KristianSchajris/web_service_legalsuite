import { Request, Response } from 'express';
import { GetLawsuitsByLawyerUseCase } from '../../application/use-cases/lawsuit/GetLawsuitsByLawyerUseCase';
import { LawsuitMapper } from '../mappers';
import { errorHandler } from '../../infrastructure/utils/ErrorHandler';
import { CommonErrors } from '../../infrastructure/utils/error-types';

export class ReportController {
  private lawsuitMapper: LawsuitMapper;

  constructor(private getLawsuitsByLawyerUseCase: GetLawsuitsByLawyerUseCase) {
    this.lawsuitMapper = new LawsuitMapper();
  }

  async getLawsuitsByLawyer(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      
      // Validar UUID del abogado
      const uuidError = errorHandler.validateUUID(id, 'lawyer_id');
      if (uuidError) {
        return errorHandler.handleValidationError([uuidError], req, res);
      }
      
      const report = await this.getLawsuitsByLawyerUseCase.execute(id);
      
      // El caso de uso ya devuelve los datos en el formato correcto para el reporte
      // No necesitamos usar el mapper aquí porque no son LawsuitProps completos
      return res.status(200).json(report);
    } catch (error: any) {
      // Mapear errores específicos del dominio
      if (error.message.includes('no encontrado')) {
        const notFoundError = errorHandler.createFromTemplate(
          CommonErrors.LAWYER_NOT_FOUND,
          { lawyerId: req.params.id },
          req.requestId
        );
        return errorHandler.handleControllerError(notFoundError, req, res);
      }
      
      return errorHandler.handleControllerError(error, req, res, { 
        action: 'get_lawsuits_by_lawyer',
        lawyerId: req.params.id 
      });
    }
  }
}
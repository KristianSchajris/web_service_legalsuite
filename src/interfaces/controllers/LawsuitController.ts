import { Request, Response } from 'express';
import { CreateLawsuitUseCase } from '../../application/use-cases/lawsuit/CreateLawsuitUseCase';
import { GetLawsuitsUseCase } from '../../application/use-cases/lawsuit/GetLawsuitsUseCase';
import { AssignLawyerToLawsuitUseCase } from '../../application/use-cases/lawsuit/AssignLawyerToLawsuitUseCase';
import { LawsuitStatus } from '../../domain/entities/Lawsuit';
import { LawsuitMapper, LawsuitAssignMapper } from '../mappers';
import { errorHandler } from '../../infrastructure/utils/ErrorHandler';
import { CommonErrors, ErrorCategory, ErrorSeverity } from '../../infrastructure/utils/error-types';

export class LawsuitController {
  private lawsuitMapper: LawsuitMapper;
  private lawsuitAssignMapper: LawsuitAssignMapper;

  constructor(
    private createLawsuitUseCase: CreateLawsuitUseCase,
    private getLawsuitsUseCase: GetLawsuitsUseCase,
    private assignLawyerToLawsuitUseCase: AssignLawyerToLawsuitUseCase
  ) {
    this.lawsuitMapper = new LawsuitMapper();
    this.lawsuitAssignMapper = new LawsuitAssignMapper();
  }

  async create(req: Request, res: Response): Promise<Response | void> {
    try {
      const validationErrors = errorHandler.validateRequiredFields(
        req.body, 
        ['case_number', 'plaintiff', 'defendant', 'case_type', 'status']
      );
      
      if (validationErrors.length > 0) {
        return errorHandler.handleValidationError(validationErrors, req, res);
      }

      // Convertir datos de API a formato de entidad usando el mapper
      const lawsuitData = this.lawsuitMapper.fromApiRequest(req.body);
      
      // Crear DTO con los campos requeridos
      const createLawsuitDTO = {
        caseNumber: lawsuitData.caseNumber!,
        plaintiff: lawsuitData.plaintiff!,
        defendant: lawsuitData.defendant!,
        caseType: lawsuitData.caseType!,
        status: lawsuitData.status!
      };
      
      const lawsuitProps = await this.createLawsuitUseCase.execute(createLawsuitDTO);
      
      // Convertir propiedades a formato de API usando el mapper
      const response = this.lawsuitMapper.propsToApiResponse(lawsuitProps);
      return res.status(201).json(response);
    } catch (error: any) {
      return errorHandler.handleControllerError(error, req, res, { 
        action: 'create_lawsuit',
        data: req.body 
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response | void> {
    try {
      const filters: any = {};
      
      if (req.query.status) {
        filters.status = req.query.status as LawsuitStatus;
      }
      
      if (req.query.lawyer_id) {
        // Validar UUID del abogado si se proporciona
        const uuidError = errorHandler.validateUUID(req.query.lawyer_id as string, 'lawyer_id');
        if (uuidError) {
          return errorHandler.handleValidationError([uuidError], req, res);
        }
        filters.lawyerId = req.query.lawyer_id as string;
      }
      
      // Get pagination parameters with defaults
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      
      const result = await this.getLawsuitsUseCase.execute(filters, page, limit);
      
      // Convertir propiedades a formato de API usando el mapper
      const lawsuits = result.lawsuits.map(lawsuitProps => 
        this.lawsuitMapper.propsToApiResponse(lawsuitProps)
      );
      
      return res.status(200).json({
        data: lawsuits,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error: any) {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      return errorHandler.handleControllerError(error, req, res, { 
        action: 'get_all_lawsuits',
        filters: req.query,
        pagination: { page, limit }
      });
    }
  }

  async getById(req: Request, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      
      // Validar UUID
      const uuidError = errorHandler.validateUUID(id);
      if (uuidError) {
        return errorHandler.handleValidationError([uuidError], req, res);
      }
      
      // Este endpoint no está implementado aún
      const notImplementedError = errorHandler.createError({
        code: 'ENDPOINT_NOT_IMPLEMENTED',
        message: 'Este endpoint aún no está implementado',
        category: ErrorCategory.INTERNAL_SERVER,
        severity: ErrorSeverity.LOW,
        statusCode: 501
      });
      return errorHandler.handleControllerError(notImplementedError, req, res);
      
    } catch (error: any) {
      return errorHandler.handleControllerError(error, req, res, { 
        action: 'get_lawsuit_by_id',
        lawsuitId: req.params.id 
      });
    }
  }

  async assignLawyer(req: Request, res: Response): Promise<Response | void> {
    const { id: lawsuitId } = req.params;
    
    try {
      // Validar UUID del lawsuit
      const lawsuitUuidError = errorHandler.validateUUID(lawsuitId, 'lawsuit_id');
      if (lawsuitUuidError) {
        return errorHandler.handleValidationError([lawsuitUuidError], req, res);
      }
      
      // Validar campos requeridos
      const validationErrors = errorHandler.validateRequiredFields(req.body, ['lawyer_id']);
      
      // Validar UUID del abogado
      if (req.body.lawyer_id) {
        const lawyerUuidError = errorHandler.validateUUID(req.body.lawyer_id, 'lawyer_id');
        if (lawyerUuidError) {
          validationErrors.push(lawyerUuidError);
        }
      }
      
      if (validationErrors.length > 0) {
        return errorHandler.handleValidationError(validationErrors, req, res);
      }
      
      // Convertir datos de API usando el mapper de asignación
      const assignData = this.lawsuitAssignMapper.fromApiRequest(req.body);
      
      const lawsuitProps = await this.assignLawyerToLawsuitUseCase.execute({
        lawsuitId,
        lawyerId: assignData.lawyerId!
      });
      
      // Convertir propiedades a formato de API usando el mapper
      const response = this.lawsuitMapper.propsToApiResponse(lawsuitProps);
      
      return res.status(200).json({
        success: true,
        message: 'Abogado asignado correctamente a la demanda',
        data: response
      });
      
    } catch (error: any) {
      // Mapear errores específicos del dominio
      if (error.message.includes('no encontrad')) {
        const notFoundError = error.message.includes('Demanda') 
          ? errorHandler.createFromTemplate(CommonErrors.LAWSUIT_NOT_FOUND, { lawsuitId }, req.requestId)
          : errorHandler.createFromTemplate(CommonErrors.LAWYER_NOT_FOUND, { lawyerId: req.body.lawyer_id }, req.requestId);
        return errorHandler.handleControllerError(notFoundError, req, res);
      }
      
      if (error.message.includes('ya está asignado')) {
        const businessError = errorHandler.createFromTemplate(
          CommonErrors.LAWYER_ALREADY_ASSIGNED,
          { lawsuitId, lawyerId: req.body.lawyer_id },
          req.requestId
        );
        return errorHandler.handleControllerError(businessError, req, res);
      }
      
      if (error.message.includes('no está disponible')) {
        const businessError = errorHandler.createFromTemplate(
          CommonErrors.LAWYER_NOT_AVAILABLE,
          { lawyerId: req.body.lawyer_id },
          req.requestId
        );
        return errorHandler.handleControllerError(businessError, req, res);
      }
      
      // Error genérico
      return errorHandler.handleControllerError(error, req, res, { 
        action: 'assign_lawyer_to_lawsuit',
        lawsuitId,
        lawyerId: req.body.lawyer_id 
      });
    }
  }
}
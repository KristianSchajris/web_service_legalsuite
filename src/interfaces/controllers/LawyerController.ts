import { Request, Response } from 'express';
import { CreateLawyerUseCase } from '../../application/use-cases/lawyer/CreateLawyerUseCase';
import { GetLawyersUseCase } from '../../application/use-cases/lawyer/GetLawyersUseCase';
import { GetLawyerByIdUseCase } from '../../application/use-cases/lawyer/GetLawyerByIdUseCase';
import { LawyerMapper } from '../mappers';
import { errorHandler } from '../../infrastructure/utils/ErrorHandler';
import { CommonErrors } from '../../infrastructure/utils/error-types';

export class LawyerController {
  private lawyerMapper: LawyerMapper;

  constructor(
    private createLawyerUseCase: CreateLawyerUseCase,
    private getLawyersUseCase: GetLawyersUseCase,
    private getLawyerByIdUseCase: GetLawyerByIdUseCase
  ) {
    this.lawyerMapper = new LawyerMapper();
  }

  async create(req: Request, res: Response): Promise<Response | void> {
    try {
      // Validar campos requeridos
      const validationErrors = errorHandler.validateRequiredFields(
        req.body, 
        ['name', 'email', 'phone', 'specialization', 'status']
      );
      
      // Validar formato de email
      if (req.body.email) {
        const emailError = errorHandler.validateEmail(req.body.email);
        if (emailError) {
          validationErrors.push(emailError);
        }
      }
      
      if (validationErrors.length > 0) {
        return errorHandler.handleValidationError(validationErrors, req, res);
      }

      // Convertir datos de API a formato de entidad usando el mapper
      const lawyerData = this.lawyerMapper.fromApiRequest(req.body);
      
      // Crear DTO con los campos requeridos
      const createLawyerDTO = {
        name: lawyerData.name!,
        email: lawyerData.email!,
        phone: lawyerData.phone!,
        specialization: lawyerData.specialization!,
        status: lawyerData.status!
      };
      
      const lawyerProps = await this.createLawyerUseCase.execute(createLawyerDTO);
      
      // Convertir propiedades a formato de API usando el mapper
      const response = this.lawyerMapper.propsToApiResponse(lawyerProps);
      return res.status(201).json(response);
    } catch (error: any) {
      return errorHandler.handleControllerError(error, req, res, { 
        action: 'create_lawyer',
        data: req.body 
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response | void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.getLawyersUseCase.execute(page, limit);
      
      // Convertir propiedades a formato de API usando el mapper
      const lawyers = result.lawyers.map(lawyerProps => 
        this.lawyerMapper.propsToApiResponse(lawyerProps)
      );
      
      return res.status(200).json({
        lawyers,
        total: result.total,
        page,
        limit
      });
    } catch (error: any) {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      return errorHandler.handleControllerError(error, req, res, { 
        action: 'get_all_lawyers',
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
      
      const lawyerProps = await this.getLawyerByIdUseCase.execute(id);
      
      if (!lawyerProps) {
        const notFoundError = errorHandler.createFromTemplate(
          CommonErrors.LAWYER_NOT_FOUND,
          { lawyerId: id },
          req.requestId
        );
        return errorHandler.handleControllerError(notFoundError, req, res);
      }
      
      // Convertir propiedades a formato de API usando el mapper
      const response = this.lawyerMapper.propsToApiResponse(lawyerProps);
      return res.status(200).json(response);
    } catch (error: any) {
      return errorHandler.handleControllerError(error, req, res, { 
        action: 'get_lawyer_by_id',
        lawyerId: req.params.id 
      });
    }
  }
}
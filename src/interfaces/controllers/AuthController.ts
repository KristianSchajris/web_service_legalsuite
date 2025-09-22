import { Request, Response } from 'express';
import { LoginUseCase } from '../../application/use-cases/auth/LoginUseCase';
import { UserLoginMapper } from '../mappers';
import { errorHandler } from '../../infrastructure/utils/ErrorHandler';
import { CommonErrors } from '../../infrastructure/utils/error-types';

export class AuthController {
  private userLoginMapper: UserLoginMapper;

  constructor(private loginUseCase: LoginUseCase) {
    this.userLoginMapper = new UserLoginMapper();
  }

  async login(req: Request, res: Response): Promise<Response | void> {
    try {
      // Validar campos requeridos
      const validationErrors = errorHandler.validateRequiredFields(req.body, ['username', 'password']);
      if (validationErrors.length > 0) {
        return errorHandler.handleValidationError(validationErrors, req, res);
      }

      // Convertir datos de API usando el mapper
      const loginData = this.userLoginMapper.fromApiRequest(req.body);
      
      // Crear DTO con los campos requeridos
      const loginDTO = {
        username: loginData.username!,
        password: loginData.password!
      };
      
      const result = await this.loginUseCase.execute(loginDTO);
      return res.status(200).json(result);
    } catch (error: any) {
      // Usar el nuevo sistema de manejo de errores
      if (error.message.includes('Invalid credentials') || error.message.includes('credenciales')) {
        const authError = errorHandler.createFromTemplate(
          CommonErrors.INVALID_CREDENTIALS,
          { username: req.body.username },
          req.requestId
        );
        return errorHandler.handleControllerError(authError, req, res);
      }
      
      // Error genérico
      return errorHandler.handleControllerError(error, req, res, { 
        action: 'login',
        username: req.body.username 
      });
    }
  }
}

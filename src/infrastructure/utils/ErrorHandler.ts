import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { 
  AppError, 
  ErrorDetails, 
  ErrorResponse, 
  ValidationErrorResponse, 
  ValidationErrorDetail,
  ErrorCategory, 
  ErrorSeverity,
  CommonErrors 
} from './error-types';
import { StructuredConsoleLogger } from '../logging/StructuredConsoleLogger';
import { StructuredLogger } from '../../domain/interfaces/StructuredLogger';

/**
 * Clase centralizada para el manejo de errores en la aplicación
 * Proporciona funcionalidades para registro, categorización, notificación y gestión de errores
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private logger: StructuredLogger;

  private constructor(logger?: StructuredLogger) {
    this.logger = logger || new StructuredConsoleLogger();
  }

  /**
   * Obtiene la instancia singleton del ErrorHandler
   */
  public static getInstance(logger?: StructuredLogger): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler(logger);
    }
    return ErrorHandler.instance;
  }

  /**
   * Crea un nuevo error estructurado
   */
  public createError(details: ErrorDetails): AppError {
    return new AppError(details);
  }

  /**
   * Crea un error usando una plantilla predefinida
   */
  public createFromTemplate(
    template: typeof CommonErrors[keyof typeof CommonErrors],
    context?: Record<string, any>,
    requestId?: string,
    userId?: string
  ): AppError {
    return this.createError({
      ...template,
      context,
      requestId,
      userId
    });
  }

  /**
   * Formatea una respuesta de error estándar
   */
  public formatErrorResponse(error: AppError | Error, requestId?: string): ErrorResponse {
    if (error instanceof AppError) {
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          category: error.category,
          timestamp: error.timestamp.toISOString(),
          requestId: error.requestId || requestId,
          details: this.shouldIncludeDetails() ? error.context : undefined
        }
      };
    }

    // Error genérico
    return {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: this.shouldIncludeDetails() ? error.message : 'Error interno del servidor',
        category: ErrorCategory.INTERNAL_SERVER,
        timestamp: new Date().toISOString(),
        requestId
      }
    };
  }

  /**
   * Formatea una respuesta de error de validación
   */
  public formatValidationErrorResponse(
    validationErrors: ValidationErrorDetail[],
    requestId?: string
  ): ValidationErrorResponse {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Errores de validación en los datos proporcionados',
        category: ErrorCategory.VALIDATION,
        timestamp: new Date().toISOString(),
        requestId,
        validationErrors
      }
    };
  }

  /**
   * Maneja errores en controladores de Express
   */
  public handleControllerError(
    error: Error | AppError,
    req: Request,
    res: Response,
    context?: Record<string, any>
  ): void {
    const requestId = this.getRequestId(req);
    const userId = this.getUserId(req);

    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else {
      // Convertir error genérico a AppError
      appError = this.createError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
        category: ErrorCategory.INTERNAL_SERVER,
        severity: ErrorSeverity.HIGH,
        statusCode: 500,
        context: { ...context, originalError: error.name },
        requestId,
        userId
      });
    }

    // Registrar el error
    this.logError(appError, req);

    // Enviar respuesta
    const response = this.formatErrorResponse(appError, requestId);
    res.status(appError.statusCode).json(response);
  }

  /**
   * Maneja errores de validación
   */
  public handleValidationError(
    validationErrors: ValidationErrorDetail[],
    req: Request,
    res: Response
  ): void {
    const requestId = this.getRequestId(req);
    
    // Registrar error de validación
    this.logger.warn('Validation error', {
      requestId,
      url: req.url,
      method: req.method,
      validationErrors,
      timestamp: new Date().toISOString()
    });

    const response = this.formatValidationErrorResponse(validationErrors, requestId);
    res.status(400).json(response);
  }

  /**
   * Registra errores con diferentes niveles de severidad usando logging estructurado
   */
  public logError(error: AppError, req?: Request): void {
    const metadata = {
      code: error.code,
      category: error.category,
      severity: error.severity,
      statusCode: error.statusCode,
      timestamp: error.timestamp.toISOString(),
      requestId: error.requestId,
      userId: error.userId,
      context: error.context,
      stack: error.stack,
      request: req ? {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip
      } : undefined
    };

    const logMessage = `${error.severity} ERROR: ${error.message}`;

    switch (error.severity) {
      case ErrorSeverity.CRITICAL:
        this.logger.error(logMessage, error, metadata);
        this.notifyCriticalError(error, metadata);
        break;
      case ErrorSeverity.HIGH:
        this.logger.error(logMessage, error, metadata);
        break;
      case ErrorSeverity.MEDIUM:
        this.logger.warn(logMessage, metadata);
        break;
      case ErrorSeverity.LOW:
        this.logger.info(logMessage, metadata);
        break;
      default:
        this.logger.error(`UNKNOWN SEVERITY ERROR: ${error.message}`, error, metadata);
    }
  }

  /**
   * Valida si un string es un UUID válido
   */
  public validateUUID(uuid: string, fieldName: string = 'id'): ValidationErrorDetail | null {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuid || !uuidRegex.test(uuid)) {
      return {
        field: fieldName,
        message: `${fieldName} debe ser un UUID válido`,
        value: uuid
      };
    }
    
    return null;
  }

  /**
   * Valida campos requeridos
   */
  public validateRequiredFields(
    data: Record<string, any>,
    requiredFields: string[]
  ): ValidationErrorDetail[] {
    const errors: ValidationErrorDetail[] = [];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        errors.push({
          field,
          message: `${field} es requerido`,
          value: data[field]
        });
      }
    }

    return errors;
  }

  /**
   * Valida el formato de email
   */
  public validateEmail(email: string, fieldName: string = 'email'): ValidationErrorDetail | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      return {
        field: fieldName,
        message: `${fieldName} debe tener un formato válido`,
        value: email
      };
    }
    
    return null;
  }

  /**
   * Middleware para capturar errores no manejados
   */
  public globalErrorMiddleware() {
    return (error: Error, req: Request, res: Response, next: any) => {
      this.handleControllerError(error, req, res);
    };
  }

  /**
   * Middleware para agregar requestId a las peticiones
   */
  public requestIdMiddleware() {
    return (req: Request, res: Response, next: any) => {
      req.requestId = uuidv4();
      res.setHeader('X-Request-ID', req.requestId);
      next();
    };
  }

  /**
   * Obtiene el ID de la petición
   */
  private getRequestId(req: Request): string {
    return req.requestId || uuidv4();
  }

  /**
   * Obtiene el ID del usuario de la petición
   */
  private getUserId(req: Request): string | undefined {
    return (req as any).user?.id;
  }

  /**
   * Determina si se deben incluir detalles del error en la respuesta
   */
  private shouldIncludeDetails(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  /**
   * Notifica errores críticos (se puede extender para enviar emails, Slack, etc.)
   */
  private notifyCriticalError(error: AppError, metadata: any): void {
    // Aquí se pueden implementar notificaciones a sistemas externos
    // Por ejemplo: envío de emails, notificaciones a Slack, etc.
    this.logger.error('CRITICAL ERROR NOTIFICATION', {
      ...metadata,
      notificationSent: true
    });
  }
}

// Extensión del tipo Request para incluir requestId
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

// Exportar instancia singleton
export const errorHandler = ErrorHandler.getInstance();
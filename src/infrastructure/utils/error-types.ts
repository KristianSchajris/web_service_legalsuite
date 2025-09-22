/**
 * Tipos y interfaces para el manejo centralizado de errores
 */

export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  DATABASE = 'DATABASE',
  INTERNAL_SERVER = 'INTERNAL_SERVER'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ErrorDetails {
  code: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  statusCode: number;
  context?: Record<string, any>;
  timestamp?: Date;
  requestId?: string;
  userId?: string;
  stack?: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    category: ErrorCategory;
    timestamp: string;
    requestId?: string;
    details?: Record<string, any>;
  };
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationErrorResponse extends ErrorResponse {
  error: ErrorResponse['error'] & {
    validationErrors: ValidationErrorDetail[];
  };
}

export class AppError extends Error {
  public readonly code: string;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly statusCode: number;
  public readonly context?: Record<string, any>;
  public readonly timestamp: Date;
  public readonly requestId?: string;
  public readonly userId?: string;

  constructor(details: ErrorDetails) {
    super(details.message);
    this.name = 'AppError';
    this.code = details.code;
    this.category = details.category;
    this.severity = details.severity;
    this.statusCode = details.statusCode;
    this.context = details.context;
    this.timestamp = details.timestamp || new Date();
    this.requestId = details.requestId;
    this.userId = details.userId;

    // Mantener el stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

// Errores predefinidos comunes
export const CommonErrors = {
  // Validación
  INVALID_UUID: {
    code: 'INVALID_UUID',
    message: 'El ID proporcionado no es un UUID válido',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    statusCode: 400
  },
  MISSING_REQUIRED_FIELD: {
    code: 'MISSING_REQUIRED_FIELD',
    message: 'Campo requerido faltante',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    statusCode: 400
  },
  INVALID_INPUT_FORMAT: {
    code: 'INVALID_INPUT_FORMAT',
    message: 'Formato de entrada inválido',
    category: ErrorCategory.VALIDATION,
    severity: ErrorSeverity.LOW,
    statusCode: 400
  },

  // Autenticación
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Credenciales inválidas',
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    statusCode: 401
  },
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: 'Token expirado',
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    statusCode: 401
  },
  TOKEN_INVALID: {
    code: 'TOKEN_INVALID',
    message: 'Token inválido',
    category: ErrorCategory.AUTHENTICATION,
    severity: ErrorSeverity.MEDIUM,
    statusCode: 401
  },

  // Autorización
  INSUFFICIENT_PERMISSIONS: {
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'Permisos insuficientes',
    category: ErrorCategory.AUTHORIZATION,
    severity: ErrorSeverity.MEDIUM,
    statusCode: 403
  },

  // No encontrado
  RESOURCE_NOT_FOUND: {
    code: 'RESOURCE_NOT_FOUND',
    message: 'Recurso no encontrado',
    category: ErrorCategory.NOT_FOUND,
    severity: ErrorSeverity.LOW,
    statusCode: 404
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'Usuario no encontrado',
    category: ErrorCategory.NOT_FOUND,
    severity: ErrorSeverity.LOW,
    statusCode: 404
  },
  LAWYER_NOT_FOUND: {
    code: 'LAWYER_NOT_FOUND',
    message: 'Abogado no encontrado',
    category: ErrorCategory.NOT_FOUND,
    severity: ErrorSeverity.LOW,
    statusCode: 404
  },
  LAWSUIT_NOT_FOUND: {
    code: 'LAWSUIT_NOT_FOUND',
    message: 'Demanda no encontrada',
    category: ErrorCategory.NOT_FOUND,
    severity: ErrorSeverity.LOW,
    statusCode: 404
  },

  // Lógica de negocio
  LAWYER_ALREADY_ASSIGNED: {
    code: 'LAWYER_ALREADY_ASSIGNED',
    message: 'El abogado ya está asignado a esta demanda',
    category: ErrorCategory.BUSINESS_LOGIC,
    severity: ErrorSeverity.LOW,
    statusCode: 400
  },
  LAWYER_NOT_AVAILABLE: {
    code: 'LAWYER_NOT_AVAILABLE',
    message: 'El abogado no está disponible',
    category: ErrorCategory.BUSINESS_LOGIC,
    severity: ErrorSeverity.LOW,
    statusCode: 400
  },

  // Base de datos
  DATABASE_CONNECTION_ERROR: {
    code: 'DATABASE_CONNECTION_ERROR',
    message: 'Error de conexión a la base de datos',
    category: ErrorCategory.DATABASE,
    severity: ErrorSeverity.HIGH,
    statusCode: 500
  },
  DATABASE_QUERY_ERROR: {
    code: 'DATABASE_QUERY_ERROR',
    message: 'Error en la consulta a la base de datos',
    category: ErrorCategory.DATABASE,
    severity: ErrorSeverity.HIGH,
    statusCode: 500
  },

  // Servidor interno
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Error interno del servidor',
    category: ErrorCategory.INTERNAL_SERVER,
    severity: ErrorSeverity.HIGH,
    statusCode: 500
  },
  SERVICE_UNAVAILABLE: {
    code: 'SERVICE_UNAVAILABLE',
    message: 'Servicio no disponible',
    category: ErrorCategory.EXTERNAL_SERVICE,
    severity: ErrorSeverity.HIGH,
    statusCode: 503
  }
} as const;
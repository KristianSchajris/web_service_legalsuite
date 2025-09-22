import { Logger } from '../../domain/interfaces/Logger';
import { StructuredLogger, LogEntry, LogMetadata } from '../../domain/interfaces/StructuredLogger';

/**
 * Implementación de logger estructurado que mantiene compatibilidad con ConsoleLogger
 * Añade formato JSON, timestamp ISO 8601 y metadatos estándar
 */
export class StructuredConsoleLogger implements StructuredLogger, Logger {
  private readonly serviceName: string;
  private readonly sensitiveFields = [
    'password', 'token', 'authorization', 'secret', 'key', 'hash',
    'contraseña', 'clave', 'secreto', 'auth', 'jwt'
  ];

  constructor(serviceName: string = 'legal-suite-service') {
    this.serviceName = serviceName;
  }

  // Implementación del método log requerido por StructuredLogger
  log(entry: LogEntry): void {
    const sanitizedEntry = {
      ...entry,
      metadata: entry.metadata,
      context: entry.context ? this.sanitizeData(entry.context) : undefined
    };

    const logOutput = JSON.stringify(sanitizedEntry, null, 2);
    
    switch (entry.metadata.log_level) {
      case 'INFO':
        console.log(logOutput);
        break;
      case 'WARN':
        console.warn(logOutput);
        break;
      case 'ERROR':
        console.error(logOutput);
        break;
      case 'DEBUG':
        console.debug(logOutput);
        break;
    }
  }

  // Métodos compatibles con Logger existente (mantienen el comportamiento actual)
  info(message: string, ...args: any[]): void {
    const metadata: LogMetadata = {
      timestamp: new Date().toISOString(),
      log_level: 'INFO',
      service_name: this.serviceName
    };
    
    const entry: LogEntry = {
      message,
      metadata
    };
    this.logStructured(entry);
  }

  error(message: string, ...args: any[]): void {
    const metadata: LogMetadata = {
      timestamp: new Date().toISOString(),
      log_level: 'ERROR',
      service_name: this.serviceName
    };
    
    const entry: LogEntry = {
      message,
      metadata
    };
    this.logStructured(entry);
  }

  warn(message: string, ...args: any[]): void {
    const metadata: LogMetadata = {
      timestamp: new Date().toISOString(),
      log_level: 'WARN',
      service_name: this.serviceName
    };
    
    const entry: LogEntry = {
      message,
      metadata
    };
    this.logStructured(entry);
  }

  debug(message: string, ...args: any[]): void {
    const metadata: LogMetadata = {
      timestamp: new Date().toISOString(),
      log_level: 'DEBUG',
      service_name: this.serviceName
    };
    
    const entry: LogEntry = {
      message,
      metadata
    };
    this.logStructured(entry);
  }

  // Métodos estructurados
  logStructured(entry: LogEntry): void {
    const sanitizedEntry = {
      ...entry,
      metadata: entry.metadata,
      context: entry.context ? this.sanitizeData(entry.context) : undefined
    };

    const logOutput = JSON.stringify(sanitizedEntry, null, 2);
    
    switch (entry.metadata.log_level) {
      case 'INFO':
        console.log(logOutput);
        break;
      case 'WARN':
        console.warn(logOutput);
        break;
      case 'ERROR':
        console.error(logOutput);
        break;
      case 'DEBUG':
        console.debug(logOutput);
        break;
    }
  }

  infoStructured(message: string, context?: Record<string, any>, metadata?: Partial<LogMetadata>): void {
    const fullMetadata: LogMetadata = {
      timestamp: new Date().toISOString(),
      log_level: 'INFO',
      service_name: this.serviceName,
      ...metadata
    };
    
    this.logStructured({ message, metadata: fullMetadata, context });
  }

  errorStructured(message: string, context?: Record<string, any>, metadata?: Partial<LogMetadata>): void {
    const fullMetadata: LogMetadata = {
      timestamp: new Date().toISOString(),
      log_level: 'ERROR',
      service_name: this.serviceName,
      ...metadata
    };
    
    this.logStructured({ message, metadata: fullMetadata, context });
  }

  warnStructured(message: string, context?: Record<string, any>, metadata?: Partial<LogMetadata>): void {
    const fullMetadata: LogMetadata = {
      timestamp: new Date().toISOString(),
      log_level: 'WARN',
      service_name: this.serviceName,
      ...metadata
    };
    
    this.logStructured({ message, metadata: fullMetadata, context });
  }

  debugStructured(message: string, context?: Record<string, any>, metadata?: Partial<LogMetadata>): void {
    const fullMetadata: LogMetadata = {
      timestamp: new Date().toISOString(),
      log_level: 'DEBUG',
      service_name: this.serviceName,
      ...metadata
    };
    
    this.logStructured({ message, metadata: fullMetadata, context });
  }

  // Método para sanitizar datos sensibles
  sanitizeData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'string') {
      // No sanitizar strings directamente, solo objetos con propiedades sensibles
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    if (typeof data === 'object') {
      const sanitized: any = {};
      
      for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();
        
        // Verificar si la clave contiene información sensible
        const isSensitive = this.sensitiveFields.some(field => 
          lowerKey.includes(field.toLowerCase())
        );
        
        if (isSensitive) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = this.sanitizeData(value);
        } else {
          sanitized[key] = value;
        }
      }
      
      return sanitized;
    }

    return data;
  }
}

/**
 * Interfaces para el logger estructurado del sistema
 * Define contratos para logging con metadatos estructurados
 */

export interface LogMetadata {
  requestId?: string;
  userId?: string;
  action?: string;
  resource?: string;
  duration?: number;
  statusCode?: number;
  [key: string]: any;
}

export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: Date;
  metadata?: LogMetadata;
  error?: Error;
}

export interface StructuredLogger {
  /**
   * Registra una entrada de log estructurada
   * @param entry La entrada de log con todos sus metadatos
   */
  log(entry: LogEntry): void;

  /**
   * Registra información estructurada
   * @param message El mensaje
   * @param metadata Los metadatos asociados
   */
  info(message: string, metadata?: LogMetadata): void;

  /**
   * Registra errores estructurados
   * @param message El mensaje de error
   * @param error El error opcional
   * @param metadata Los metadatos asociados
   */
  error(message: string, error?: Error, metadata?: LogMetadata): void;

  /**
   * Registra advertencias estructuradas
   * @param message El mensaje de advertencia
   * @param metadata Los metadatos asociados
   */
  warn(message: string, metadata?: LogMetadata): void;

  /**
   * Registra información de debug estructurada
   * @param message El mensaje de debug
   * @param metadata Los metadatos asociados
   */
  debug(message: string, metadata?: LogMetadata): void;
}
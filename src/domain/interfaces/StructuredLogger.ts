/**
 * Interfaz para logging estructurado con formato JSON
 * Incluye metadatos estándar como timestamp ISO 8601, log_level y service_name
 */
export interface LogMetadata {
  timestamp: string; // ISO 8601 format
  log_level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service_name: string;
  function_name?: string;
  user_id?: string;
  request_id?: string;
  [key: string]: any; // Permite metadatos adicionales
}

export interface LogEntry {
  message: string;
  metadata: LogMetadata;
  context?: Record<string, any>; // Datos adicionales no sensibles
}

/**
 * Interfaz de logger estructurado que mantiene compatibilidad con Logger existente
 * pero añade capacidades de logging estructurado
 */
export interface StructuredLogger {
  // Métodos compatibles con Logger existente
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;

  // Métodos estructurados nuevos
  logStructured(entry: LogEntry): void;
  infoStructured(message: string, context?: Record<string, any>, metadata?: Partial<LogMetadata>): void;
  errorStructured(message: string, context?: Record<string, any>, metadata?: Partial<LogMetadata>): void;
  warnStructured(message: string, context?: Record<string, any>, metadata?: Partial<LogMetadata>): void;
  debugStructured(message: string, context?: Record<string, any>, metadata?: Partial<LogMetadata>): void;

  // Método para sanitizar datos sensibles
  sanitizeData(data: any): any;
}
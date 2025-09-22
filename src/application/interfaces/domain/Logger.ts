/**
 * Interfaz para el logger del sistema
 * Define los métodos básicos de logging
 */
export interface Logger {
  /**
   * Registra un mensaje de información
   * @param message El mensaje a registrar
   * @param meta Metadatos adicionales opcionales
   */
  info(message: string, meta?: any): void;

  /**
   * Registra un mensaje de error
   * @param message El mensaje de error
   * @param error El error opcional (puede ser Error, string, o cualquier tipo)
   * @param meta Metadatos adicionales opcionales
   */
  error(message: string, error?: any, meta?: any): void;

  /**
   * Registra un mensaje de advertencia
   * @param message El mensaje de advertencia
   * @param meta Metadatos adicionales opcionales
   */
  warn(message: string, meta?: any): void;

  /**
   * Registra un mensaje de debug
   * @param message El mensaje de debug
   * @param meta Metadatos adicionales opcionales
   */
  debug(message: string, meta?: any): void;
}

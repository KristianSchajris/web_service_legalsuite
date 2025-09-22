/**
 * Interfaz abstracta para logging
 * Permite que la capa de dominio y aplicación usen logging sin depender de implementaciones específicas
 */
export interface Logger {
  info(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}
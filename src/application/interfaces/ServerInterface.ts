/**
 * Interfaz para el servidor de la aplicación
 * Define el contrato que debe cumplir cualquier implementación de servidor
 */
export interface ServerInterface {
  /**
   * Inicia el servidor y todos sus servicios
   * - Sincroniza la base de datos
   * - Inicia el servidor HTTP
   * - Configura los manejadores de procesos
   * @returns Promise que se resuelve cuando el servidor está listo
   */
  start(): Promise<void>;
}
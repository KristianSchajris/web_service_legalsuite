/**
 * Interfaz para el servicio de base de datos
 * Define el contrato que debe cumplir cualquier implementación de base de datos
 */
export interface DatabaseInterface {
  /**
   * Sincroniza la base de datos con los modelos definidos
   * @param options Opciones de sincronización
   * @returns Promise que se resuelve cuando la sincronización está completa
   */
  sync(options?: { alter?: boolean }): Promise<void>;

  /**
   * Cierra la conexión a la base de datos
   * @returns Promise que se resuelve cuando la conexión se ha cerrado
   */
  close(): Promise<void>;
}
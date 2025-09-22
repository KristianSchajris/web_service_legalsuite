/**
 * Interfaz para la aplicación web
 * Define el contrato que debe cumplir cualquier implementación de aplicación web
 */
export interface WebApplicationInterface {
  /**
   * Inicia el servidor web en el puerto especificado
   * @param port Puerto en el que escuchar las conexiones
   * @param callback Función callback que se ejecuta cuando el servidor está listo
   * @returns El servidor HTTP creado
   */
  listen(port: number, callback?: () => void): any;
}
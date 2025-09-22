import { Application } from 'express';

/**
 * Interfaz para la aplicación Express
 * Define el contrato que debe cumplir cualquier implementación de aplicación Express
 */
export interface ExpressAppInterface {
  /**
   * Obtiene la instancia de Express configurada
   * @returns La aplicación Express
   */
  getApp(): Application;

  /**
   * Agrega un middleware personalizado a la aplicación
   * @param middleware El middleware a agregar
   */
  addMiddleware(middleware: any): void;

  /**
   * Agrega una ruta personalizada a la aplicación
   * @param path La ruta
   * @param router El router o handler
   */
  addRoute(path: string, router: any): void;

  /**
   * Reinicia la configuración de la aplicación
   * Útil para testing o reconfiguración dinámica
   */
  reset(): void;
}
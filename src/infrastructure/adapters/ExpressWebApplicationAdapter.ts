import { Application } from 'express';
import { WebApplicationInterface } from '../../application/interfaces/WebApplicationInterface';

/**
 * Adaptador para Express que implementa la interfaz WebApplicationInterface
 * Permite usar Express como implementación de aplicación web siguiendo el principio de inversión de dependencias
 */
export class ExpressWebApplicationAdapter implements WebApplicationInterface {
  constructor(private app: Application) {}

  listen(port: number, callback?: () => void): any {
    return this.app.listen(port, callback);
  }
}
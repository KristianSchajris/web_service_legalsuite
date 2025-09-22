import * as dotenv from 'dotenv';
import { ConfigurationInterface } from '../../application/interfaces/ConfigurationInterface';

/**
 * Adaptador para la configuración usando dotenv
 * Implementa ConfigurationInterface para cargar variables de entorno desde archivos .env
 */
export class DotenvConfigurationAdapter implements ConfigurationInterface {
  private initialized = false;

  /**
   * Inicializa la configuración cargando variables de entorno
   */
  initialize(): void {
    if (!this.initialized) {
      dotenv.config();
      this.initialized = true;
    }
  }

  /**
   * Obtiene el puerto del servidor desde la configuración
   * @returns El puerto configurado o 3000 por defecto
   */
  getPort(): number {
    return parseInt(process.env.PORT || '3000', 10);
  }

  /**
   * Obtiene el entorno de ejecución actual
   * @returns El entorno (development, production, test)
   */
  getEnvironment(): string {
    return process.env.NODE_ENV || 'development';
  }

  /**
   * Obtiene el nombre de la base de datos
   * @returns El nombre de la base de datos configurado
   */
  getDatabaseName(): string {
    const env = this.getEnvironment();
    if (env === 'test') {
      return process.env.DB_NAME || 'legalsuite_test';
    }
    return process.env.DB_NAME || 'legalsuite';
  }

  /**
   * Obtiene el usuario de la base de datos
   * @returns El usuario de la base de datos configurado
   */
  getDatabaseUser(): string {
    return process.env.DB_USER || 'postgres';
  }

  /**
   * Obtiene la contraseña de la base de datos
   * @returns La contraseña de la base de datos configurada
   */
  getDatabasePassword(): string {
    return process.env.DB_PASSWORD || 'postgres';
  }

  /**
   * Obtiene el host de la base de datos
   * @returns El host de la base de datos configurado
   */
  getDatabaseHost(): string {
    return process.env.DB_HOST || 'localhost';
  }

  /**
   * Obtiene el puerto de la base de datos
   * @returns El puerto de la base de datos configurado
   */
  getDatabasePort(): number {
    return parseInt(process.env.DB_PORT || '5432', 10);
  }
}

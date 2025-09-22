import { DatabaseInterface } from '../../application/interfaces/DatabaseInterface';
import { DatabaseConfig } from '../config/database';
import { Sequelize } from 'sequelize';

/**
 * Adaptador para Sequelize que implementa la interfaz DatabaseInterface
 * Permite usar Sequelize como implementación de base de datos siguiendo el principio de inversión de dependencias
 * Utiliza DatabaseConfig como punto de acceso único a la base de datos
 */
export class SequelizeDatabaseAdapter implements DatabaseInterface {
  private sequelize: Sequelize;
  private databaseConfig: DatabaseConfig;

  constructor() {
    this.databaseConfig = new DatabaseConfig();
    this.sequelize = this.databaseConfig.getSequelize();
  }

  async sync(options?: { alter?: boolean }): Promise<void> {
    await this.sequelize.sync(options);
  }

  async close(): Promise<void> {
    await this.sequelize.close();
  }
}
import { Sequelize } from 'sequelize';
import { DotenvConfigurationAdapter } from '../adapters/DotenvConfigurationAdapter';

/**
 * Configuración de la base de datos usando Sequelize
 */
export class DatabaseConfig {
  private sequelize: Sequelize;
  private config: DotenvConfigurationAdapter;

  constructor() {
    this.config = new DotenvConfigurationAdapter();
    this.config.initialize();
    
    this.sequelize = new Sequelize({
      database: this.config.getDatabaseName(),
      username: this.config.getDatabaseUser(),
      password: this.config.getDatabasePassword(),
      host: this.config.getDatabaseHost(),
      port: this.config.getDatabasePort(),
      dialect: 'postgres',
      logging: this.config.getEnvironment() === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }

  /**
   * Obtiene la instancia de Sequelize
   * @returns La instancia configurada de Sequelize
   */
  getSequelize(): Sequelize {
    return this.sequelize;
  }

  /**
   * Prueba la conexión a la base de datos
   * @returns Promise que se resuelve si la conexión es exitosa
   */
  async testConnection(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  /**
   * Sincroniza los modelos con la base de datos
   * @param force Si debe forzar la recreación de las tablas
   * @returns Promise que se resuelve cuando la sincronización termina
   */
  async sync(force: boolean = false): Promise<void> {
    try {
      await this.sequelize.sync({ force });
      console.log('Database synchronized successfully.');
    } catch (error) {
      console.error('Error synchronizing database:', error);
      throw error;
    }
  }

  /**
   * Cierra la conexión a la base de datos
   * @returns Promise que se resuelve cuando la conexión se cierra
   */
  async close(): Promise<void> {
    try {
      await this.sequelize.close();
      console.log('Database connection closed.');
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }
}

// Instancia singleton de la configuración de base de datos
const databaseConfig = new DatabaseConfig();
export const sequelize = databaseConfig.getSequelize();
export default databaseConfig;

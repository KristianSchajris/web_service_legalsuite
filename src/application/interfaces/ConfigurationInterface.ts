/**
 * Interfaz para el servicio de configuración
 * Define el contrato que debe cumplir cualquier implementación de configuración
 */
export interface ConfigurationInterface {
  /**
   * Obtiene el puerto del servidor desde la configuración
   * @returns El puerto configurado o un valor por defecto
   */
  getPort(): number;

  /**
   * Obtiene el entorno de ejecución actual
   * @returns El entorno (development, production, test)
   */
  getEnvironment(): string;

  /**
   * Inicializa la configuración cargando variables de entorno
   */
  initialize(): void;

  /**
   * Obtiene el nombre de la base de datos
   * @returns El nombre de la base de datos configurado
   */
  getDatabaseName(): string;

  /**
   * Obtiene el usuario de la base de datos
   * @returns El usuario de la base de datos configurado
   */
  getDatabaseUser(): string;

  /**
   * Obtiene la contraseña de la base de datos
   * @returns La contraseña de la base de datos configurada
   */
  getDatabasePassword(): string;

  /**
   * Obtiene el host de la base de datos
   * @returns El host de la base de datos configurado
   */
  getDatabaseHost(): string;

  /**
   * Obtiene el puerto de la base de datos
   * @returns El puerto de la base de datos configurado
   */
  getDatabasePort(): number;
}
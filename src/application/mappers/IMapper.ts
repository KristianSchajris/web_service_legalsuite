/**
 * Interfaces base para los mappers del sistema
 * Define los contratos que deben cumplir todos los mappers
 */

/**
 * Interfaz genérica para mappers completos
 * Combina las funcionalidades de request y response mapping
 */
export interface IMapper<TEntity, TApiRequest, TApiResponse> {
  /**
   * Convierte datos de API request a propiedades de entidad
   * @param apiData Los datos de la API request
   * @returns Las propiedades de la entidad
   */
  apiRequestToEntityProps(apiData: TApiRequest): Partial<TEntity>;

  /**
   * Convierte una entidad a formato de respuesta de API
   * @param entity La entidad a convertir
   * @returns Los datos formateados para la API response
   */
  entityToApiResponse(entity: TEntity): TApiResponse;

  /**
   * Convierte múltiples entidades a formato de respuesta de API
   * @param entities Las entidades a convertir
   * @returns Array de datos formateados para la API response
   */
  entitiesToApiResponse(entities: TEntity[]): TApiResponse[];
}

/**
 * Interfaz para mappers de solo respuesta
 * Para casos donde solo se necesita convertir entidades a respuestas de API
 */
export interface IResponseMapper<TEntity, TApiResponse> {
  /**
   * Convierte una entidad a formato de respuesta de API
   * @param entity La entidad a convertir
   * @returns Los datos formateados para la API response
   */
  entityToApiResponse(entity: TEntity): TApiResponse;

  /**
   * Convierte múltiples entidades a formato de respuesta de API
   * @param entities Las entidades a convertir
   * @returns Array de datos formateados para la API response
   */
  entitiesToApiResponse(entities: TEntity[]): TApiResponse[];
}

/**
 * Interfaz para mappers de solo request
 * Para casos donde solo se necesita convertir requests de API a propiedades de entidad
 */
export interface IRequestMapper<TEntity, TApiRequest> {
  /**
   * Convierte datos de API request a propiedades de entidad
   * @param apiData Los datos de la API request
   * @returns Las propiedades de la entidad
   */
  apiRequestToEntityProps(apiData: TApiRequest): Partial<TEntity>;
}
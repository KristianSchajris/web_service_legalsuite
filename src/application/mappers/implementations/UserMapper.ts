/**
 * Mapper para la entidad User
 * Convierte entre nomenclatura interna (camelCase) y API externa (snake_case)
 */

import { User, UserProps, UserRole } from '../../../domain/entities/User';
import { IMapper, IRequestMapper } from '../IMapper';
import { 
  UserLoginApiRequest,
  UserCreateApiRequest,
  UserApiResponse
} from '../UserMapperTypes';

export class UserMapper implements IMapper<UserProps, UserCreateApiRequest, UserApiResponse> {
  
  /**
   * Convierte datos de request de API para crear usuario a propiedades de entidad
   * API usa nomenclatura directa, entidad interna usa camelCase
   */
  apiRequestToEntityProps(apiData: UserCreateApiRequest): Partial<UserProps> {
    return {
      username: apiData.username,
      password: apiData.password,
      role: apiData.role as UserRole
    };
  }

  /**
   * Convierte entidad User a formato de respuesta de API (sin password)
   * Entidad interna usa camelCase, API usa snake_case para timestamps
   */
  entityToApiResponse(entity: User): UserApiResponse {
    return {
      id: entity.id!,
      username: entity.username,
      role: entity.role,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString()
    };
  }

  /**
   * Convierte múltiples entidades User a formato de respuesta de API
   */
  entitiesToApiResponse(entities: User[]): UserApiResponse[] {
    return entities.map(entity => this.entityToApiResponse(entity));
  }

  // Métodos legacy para compatibilidad
  fromApiRequest(apiData: UserCreateApiRequest): Partial<UserProps> {
    return this.apiRequestToEntityProps(apiData);
  }

  toApiResponse(entity: User): UserApiResponse {
    return this.entityToApiResponse(entity);
  }

  toApiResponseArray(entities: User[]): UserApiResponse[] {
    return this.entitiesToApiResponse(entities);
  }

  /**
   * Convierte propiedades de entidad a formato de respuesta de API (sin password)
   * Útil cuando se trabaja con datos de base de datos directamente
   */
  propsToApiResponse(props: UserProps): UserApiResponse {
    return {
      id: props.id!,
      username: props.username,
      role: props.role,
      created_at: props.createdAt!.toISOString(),
      updated_at: props.updatedAt!.toISOString()
    };
  }

  /**
   * Convierte múltiples propiedades de entidad a formato de respuesta de API
   */
  propsArrayToApiResponse(propsArray: UserProps[]): UserApiResponse[] {
    return propsArray.map(props => this.propsToApiResponse(props));
  }
}

/**
 * Mapper específico para requests de login
 */
export class UserLoginMapper implements IRequestMapper<UserProps, UserLoginApiRequest> {
  
  /**
   * Convierte datos de request de API para login a propiedades de entidad
   */
  apiRequestToEntityProps(apiData: UserLoginApiRequest): Partial<UserProps> {
    return {
      username: apiData.username,
      password: apiData.password
    };
  }

  // Método legacy para compatibilidad
  fromApiRequest(apiData: UserLoginApiRequest): Partial<UserProps> {
    return this.apiRequestToEntityProps(apiData);
  }
}
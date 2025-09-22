/**
 * Mapper para la entidad Lawyer
 * Convierte entre nomenclatura interna (camelCase) y API externa (snake_case)
 */

import { Lawyer, LawyerProps, LawyerStatus } from '../../../domain/entities/Lawyer';
import { IMapper } from '../IMapper';
import { 
  LawyerApiRequest, 
  LawyerApiResponse,
  LawyerReportResponse
} from '../LawyerMapperTypes';

export class LawyerMapper implements IMapper<LawyerProps, LawyerApiRequest, LawyerApiResponse> {
  
  /**
   * Convierte datos de request de API a propiedades de entidad Lawyer
   * API usa nomenclatura directa, entidad interna usa camelCase
   */
  apiRequestToEntityProps(apiData: LawyerApiRequest): Partial<LawyerProps> {
    return {
      name: apiData.name,
      email: apiData.email,
      phone: apiData.phone,
      specialization: apiData.specialization,
      status: apiData.status as LawyerStatus
    };
  }

  /**
   * Convierte entidad Lawyer a formato de respuesta de API
   * Entidad interna usa camelCase, API usa snake_case para timestamps
   */
  entityToApiResponse(entity: Lawyer): LawyerApiResponse {
    return {
      id: entity.id!,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      specialization: entity.specialization,
      status: entity.status,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString()
    };
  }

  /**
   * Convierte múltiples entidades Lawyer a formato de respuesta de API
   */
  entitiesToApiResponse(entities: Lawyer[]): LawyerApiResponse[] {
    return entities.map(entity => this.entityToApiResponse(entity));
  }

  // Métodos legacy para compatibilidad
  fromApiRequest(apiData: LawyerApiRequest): Partial<LawyerProps> {
    return this.apiRequestToEntityProps(apiData);
  }

  toApiResponse(entity: Lawyer): LawyerApiResponse {
    return this.entityToApiResponse(entity);
  }

  toApiResponseArray(entities: Lawyer[]): LawyerApiResponse[] {
    return this.entitiesToApiResponse(entities);
  }

  /**
   * Convierte entidad Lawyer a formato simplificado para reportes
   */
  entityToReportResponse(entity: Lawyer): LawyerReportResponse {
    return {
      id: entity.id!,
      name: entity.name
    };
  }

  /**
   * Convierte propiedades de entidad a formato de respuesta de API
   */
  propsToApiResponse(props: LawyerProps): LawyerApiResponse {
    return {
      id: props.id!,
      name: props.name,
      email: props.email,
      phone: props.phone,
      specialization: props.specialization,
      status: props.status,
      created_at: props.createdAt!.toISOString(),
      updated_at: props.updatedAt!.toISOString()
    };
  }

  /**
   * Convierte múltiples propiedades de entidad a formato de respuesta de API
   */
  propsArrayToApiResponse(propsArray: LawyerProps[]): LawyerApiResponse[] {
    return propsArray.map(props => this.propsToApiResponse(props));
  }
}
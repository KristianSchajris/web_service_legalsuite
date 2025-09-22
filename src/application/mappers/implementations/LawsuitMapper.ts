/**
 * Mapper para la entidad Lawsuit
 * Convierte entre nomenclatura interna (camelCase) y API externa (snake_case)
 */

import { Lawsuit, LawsuitProps, LawsuitStatus, LawsuitCaseType } from '../../../domain/entities/Lawsuit';
import { IMapper, IRequestMapper } from '../IMapper';
import { 
  LawsuitCreateApiRequest,
  LawsuitApiResponse,
  LawsuitAssignApiRequest,
  LawsuitReportResponse
} from '../LawsuitMapperTypes';

export class LawsuitMapper implements IMapper<LawsuitProps, LawsuitCreateApiRequest, LawsuitApiResponse> {
  
  /**
   * Convierte datos de request de API para crear demanda a propiedades de entidad
   * API usa snake_case, entidad interna usa camelCase
   */
  apiRequestToEntityProps(apiData: LawsuitCreateApiRequest): Partial<LawsuitProps> {
    return {
      caseNumber: apiData.case_number,
      plaintiff: apiData.plaintiff,
      defendant: apiData.defendant,
      caseType: apiData.case_type as LawsuitCaseType,
      status: LawsuitStatus.PENDING // Default status for new lawsuits
    };
  }

  /**
   * Convierte entidad Lawsuit a formato de respuesta de API
   * Entidad interna usa camelCase, API usa snake_case
   */
  entityToApiResponse(entity: Lawsuit): LawsuitApiResponse {
    return {
      id: entity.id!,
      case_number: entity.caseNumber,
      plaintiff: entity.plaintiff,
      defendant: entity.defendant,
      case_type: entity.caseType,
      status: entity.status,
      lawyer_id: entity.lawyerId,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString()
    };
  }

  /**
   * Convierte múltiples entidades Lawsuit a formato de respuesta de API
   */
  entitiesToApiResponse(entities: Lawsuit[]): LawsuitApiResponse[] {
    return entities.map(entity => this.entityToApiResponse(entity));
  }

  // Métodos legacy para compatibilidad
  fromApiRequest(apiData: LawsuitCreateApiRequest): Partial<LawsuitProps> {
    return this.apiRequestToEntityProps(apiData);
  }

  /**
   * Convierte datos de request de API para asignar abogado a propiedades de entidad
   * API usa snake_case (lawyer_id), entidad interna usa camelCase (lawyerId)
   */
  fromAssignApiRequest(apiData: LawsuitAssignApiRequest): Partial<LawsuitProps> {
    return {
      lawyerId: apiData.lawyer_id
    };
  }

  toApiResponse(entity: Lawsuit): LawsuitApiResponse {
    return this.entityToApiResponse(entity);
  }

  toApiResponseArray(entities: Lawsuit[]): LawsuitApiResponse[] {
    return this.entitiesToApiResponse(entities);
  }

  /**
   * Convierte entidad Lawsuit a formato simplificado para reportes
   */
  toReportResponse(entity: Lawsuit): LawsuitReportResponse {
    return {
      id: entity.id!,
      caseNumber: entity.caseNumber,
      status: entity.status
    };
  }

  /**
   * Convierte múltiples entidades Lawsuit a formato de reporte
   */
  toReportResponseArray(entities: Lawsuit[]): LawsuitReportResponse[] {
    return entities.map(entity => this.toReportResponse(entity));
  }

  /**
   * Convierte propiedades de entidad a formato de respuesta de API
   * Útil cuando se trabaja con datos de base de datos directamente
   */
  propsToApiResponse(props: LawsuitProps): LawsuitApiResponse {
    return {
      id: props.id!,
      case_number: props.caseNumber,
      plaintiff: props.plaintiff,
      defendant: props.defendant,
      case_type: props.caseType,
      status: props.status,
      lawyer_id: props.lawyerId || null,
      created_at: props.createdAt?.toISOString() || new Date().toISOString(),
      updated_at: props.updatedAt?.toISOString() || new Date().toISOString()
    };
  }

  /**
   * Convierte múltiples propiedades de entidad a formato de respuesta de API
   */
  propsArrayToApiResponse(propsArray: LawsuitProps[]): LawsuitApiResponse[] {
    return propsArray.map(props => this.propsToApiResponse(props));
  }
}

/**
 * Mapper específico para asignación de abogados a demandas
 */
export class LawsuitAssignMapper implements IRequestMapper<LawsuitProps, LawsuitAssignApiRequest> {
  
  /**
   * Convierte datos de request de API para asignar abogado a propiedades de entidad
   */
  apiRequestToEntityProps(apiData: LawsuitAssignApiRequest): Partial<LawsuitProps> {
    return {
      lawyerId: apiData.lawyer_id
    };
  }

  // Método legacy para compatibilidad
  fromApiRequest(apiData: LawsuitAssignApiRequest): Partial<LawsuitProps> {
    return this.apiRequestToEntityProps(apiData);
  }
}
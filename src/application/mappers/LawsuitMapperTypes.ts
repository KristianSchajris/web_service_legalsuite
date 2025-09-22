/**
 * Tipos específicos para el mapper de Lawsuit
 * Define las interfaces de API que difieren de la entidad interna
 */

import { LawsuitCaseType, LawsuitStatus } from '../../domain/entities/Lawsuit';

/**
 * Formato de request para crear demanda según especificación API
 */
export interface LawsuitCreateApiRequest {
  case_number: string;
  plaintiff: string;
  defendant: string;
  case_type: LawsuitCaseType;
  status: LawsuitStatus;
}

/**
 * Formato de request para asignar abogado según especificación API
 */
export interface LawsuitAssignApiRequest {
  lawyer_id: string;
}

/**
 * Formato de respuesta para demanda según especificación API
 */
export interface LawsuitApiResponse {
  id: string;
  case_number: string;
  plaintiff: string;
  defendant: string;
  case_type: LawsuitCaseType;
  status: LawsuitStatus;
  lawyer_id: string | null;
  created_at: string; // ISO string format
  updated_at: string; // ISO string format
}

/**
 * Formato simplificado para reportes
 */
export interface LawsuitReportResponse {
  id: string;
  caseNumber: string;
  status: LawsuitStatus;
}
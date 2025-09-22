/**
 * Tipos específicos para el mapper de Lawyer
 * Define las interfaces de API que difieren de la entidad interna
 */

import { LawyerStatus } from '../../domain/entities/Lawyer';

/**
 * Formato de request para crear/actualizar abogado según especificación API
 */
export interface LawyerApiRequest {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: LawyerStatus;
}

/**
 * Formato de respuesta para abogado según especificación API
 */
export interface LawyerApiResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: LawyerStatus;
  created_at: string; // ISO string format
  updated_at: string; // ISO string format
}

/**
 * Formato simplificado para reportes
 */
export interface LawyerReportResponse {
  id: string;
  name: string;
}
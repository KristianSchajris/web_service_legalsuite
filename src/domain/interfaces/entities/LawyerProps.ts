/**
 * Interfaz para las propiedades de la entidad Lawyer
 * Define la estructura de datos para los abogados del sistema
 */

export enum LawyerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface LawyerProps {
  id?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: LawyerStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
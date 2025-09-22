/**
 * Interfaz para las propiedades de la entidad Lawsuit
 * Define la estructura de datos para las demandas del sistema
 */

export enum LawsuitCaseType {
  CIVIL = 'civil',
  CRIMINAL = 'criminal',
  LABOR = 'labor',
  COMMERCIAL = 'commercial'
}

export enum LawsuitStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  RESOLVED = 'resolved'
}

export interface LawsuitProps {
  id?: string;
  caseNumber: string;
  plaintiff: string;
  defendant: string;
  caseType: LawsuitCaseType;
  status: LawsuitStatus;
  lawyerId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
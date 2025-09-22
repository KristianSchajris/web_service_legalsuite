import { Lawsuit, LawsuitStatus } from '../entities/Lawsuit';

/**
 * Interfaz para el repositorio de demandas
 * Define las operaciones que se pueden realizar con la entidad Lawsuit
 */
export interface LawsuitRepository {
  findAll(filters?: { status?: LawsuitStatus, lawyerId?: string }, page?: number, limit?: number): Promise<{ lawsuits: Lawsuit[], total: number }>;
  findById(id: string): Promise<Lawsuit | null>;
  findByLawyerId(lawyerId: string): Promise<Lawsuit[]>;
  create(lawsuit: Lawsuit): Promise<Lawsuit>;
  update(lawsuit: Lawsuit): Promise<Lawsuit>;
  delete(id: string): Promise<boolean>;
}
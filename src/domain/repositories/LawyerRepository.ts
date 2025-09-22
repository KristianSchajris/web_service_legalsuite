import { Lawyer } from '../entities/Lawyer';

/**
 * Interfaz para el repositorio de abogados
 * Define las operaciones que se pueden realizar con la entidad Lawyer
 */
export interface LawyerRepository {
  findAll(page?: number, limit?: number): Promise<{ lawyers: Lawyer[], total: number }>;
  findById(id: string): Promise<Lawyer | null>;
  create(lawyer: Lawyer): Promise<Lawyer>;
  update(lawyer: Lawyer): Promise<Lawyer>;
  delete(id: string): Promise<boolean>;
}
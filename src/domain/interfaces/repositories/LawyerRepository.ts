import { Lawyer } from '../../entities/Lawyer';

/**
 * Interfaz para el repositorio de abogados
 * Define las operaciones de persistencia para la entidad Lawyer
 */
export interface LawyerRepository {
  /**
   * Obtiene todos los abogados con paginación
   * @param page Número de página (base 1)
   * @param limit Cantidad de elementos por página
   * @returns Array de abogados y total de registros
   */
  findAll(page: number, limit: number): Promise<{ lawyers: Lawyer[]; total: number }>;

  /**
   * Busca un abogado por su ID
   * @param id El ID del abogado a buscar
   * @returns El abogado encontrado o null si no existe
   */
  findById(id: string): Promise<Lawyer | null>;

  /**
   * Busca un abogado por su email
   * @param email El email del abogado a buscar
   * @returns El abogado encontrado o null si no existe
   */
  findByEmail(email: string): Promise<Lawyer | null>;

  /**
   * Crea un nuevo abogado
   * @param lawyer El abogado a crear
   * @returns El abogado creado con su ID asignado
   */
  create(lawyer: Lawyer): Promise<Lawyer>;

  /**
   * Actualiza un abogado existente
   * @param lawyer El abogado con los datos actualizados
   * @returns El abogado actualizado
   */
  update(lawyer: Lawyer): Promise<Lawyer>;

  /**
   * Elimina un abogado por su ID
   * @param id El ID del abogado a eliminar
   * @returns true si se eliminó correctamente, false en caso contrario
   */
  delete(id: string): Promise<boolean>;
}
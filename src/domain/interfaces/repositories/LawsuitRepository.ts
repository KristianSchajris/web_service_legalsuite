import { Lawsuit } from '../../entities/Lawsuit';

/**
 * Interfaz para el repositorio de demandas
 * Define las operaciones de persistencia para la entidad Lawsuit
 */
export interface LawsuitRepository {
  /**
   * Obtiene todas las demandas con paginación y filtros opcionales
   * @param page Número de página (base 1)
   * @param limit Cantidad de elementos por página
   * @param filters Filtros opcionales para la búsqueda
   * @returns Array de demandas y total de registros
   */
  findAll(
    page: number,
    limit: number,
    filters?: {
      status?: string;
      caseType?: string;
      lawyerId?: string;
    }
  ): Promise<{ lawsuits: Lawsuit[]; total: number }>;

  /**
   * Busca una demanda por su ID
   * @param id El ID de la demanda a buscar
   * @returns La demanda encontrada o null si no existe
   */
  findById(id: string): Promise<Lawsuit | null>;

  /**
   * Busca una demanda por su número de caso
   * @param caseNumber El número de caso a buscar
   * @returns La demanda encontrada o null si no existe
   */
  findByCaseNumber(caseNumber: string): Promise<Lawsuit | null>;

  /**
   * Obtiene todas las demandas asignadas a un abogado específico
   * @param lawyerId El ID del abogado
   * @returns Array de demandas asignadas al abogado
   */
  findByLawyerId(lawyerId: string): Promise<Lawsuit[]>;

  /**
   * Crea una nueva demanda
   * @param lawsuit La demanda a crear
   * @returns La demanda creada con su ID asignado
   */
  create(lawsuit: Lawsuit): Promise<Lawsuit>;

  /**
   * Actualiza una demanda existente
   * @param lawsuit La demanda con los datos actualizados
   * @returns La demanda actualizada
   */
  update(lawsuit: Lawsuit): Promise<Lawsuit>;

  /**
   * Elimina una demanda por su ID
   * @param id El ID de la demanda a eliminar
   * @returns true si se eliminó correctamente, false en caso contrario
   */
  delete(id: string): Promise<boolean>;
}
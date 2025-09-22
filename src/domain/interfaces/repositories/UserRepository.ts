import { User } from '../../entities/User';

/**
 * Interfaz para el repositorio de usuarios
 * Define las operaciones de persistencia para la entidad User
 */
export interface UserRepository {
  /**
   * Busca un usuario por su nombre de usuario
   * @param username El nombre de usuario a buscar
   * @returns El usuario encontrado o null si no existe
   */
  findByUsername(username: string): Promise<User | null>;

  /**
   * Busca un usuario por su ID
   * @param id El ID del usuario a buscar
   * @returns El usuario encontrado o null si no existe
   */
  findById(id: string): Promise<User | null>;

  /**
   * Crea un nuevo usuario
   * @param user El usuario a crear
   * @returns El usuario creado con su ID asignado
   */
  create(user: User): Promise<User>;

  /**
   * Actualiza un usuario existente
   * @param user El usuario con los datos actualizados
   * @returns El usuario actualizado
   */
  update(user: User): Promise<User>;

  /**
   * Elimina un usuario por su ID
   * @param id El ID del usuario a eliminar
   * @returns true si se eliminó correctamente, false en caso contrario
   */
  delete(id: string): Promise<boolean>;
}
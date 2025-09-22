import { User } from '../entities/User';

/**
 * Interfaz para el repositorio de usuarios
 * Define las operaciones que se pueden realizar con la entidad User
 */
export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
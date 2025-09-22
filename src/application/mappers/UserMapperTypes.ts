/**
 * Tipos específicos para el mapper de User
 * Define las interfaces de API que difieren de la entidad interna
 */

import { UserRole } from '../../domain/entities/User';

/**
 * Formato de request para login según especificación API
 */
export interface UserLoginApiRequest {
  username: string;
  password: string;
}

/**
 * Formato de request para crear usuario según especificación API
 */
export interface UserCreateApiRequest {
  username: string;
  password: string;
  role: UserRole;
}

/**
 * Formato de respuesta para usuario según especificación API
 * (sin password por seguridad)
 */
export interface UserApiResponse {
  id: string;
  username: string;
  role: UserRole;
  created_at: string; // ISO string format
  updated_at: string; // ISO string format
}
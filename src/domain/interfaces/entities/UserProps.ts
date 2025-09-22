/**
 * Interfaz para las propiedades de la entidad User
 * Define la estructura de datos para los usuarios del sistema
 */

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator'
}

export interface UserProps {
  id?: string;
  username: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
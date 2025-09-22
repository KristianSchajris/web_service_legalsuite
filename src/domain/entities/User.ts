/**
 * Entidad User - Representa un usuario del sistema para autenticación
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

export class User {
  private readonly _id: string | undefined;
  private _username: string;
  private _password: string;
  private _role: UserRole;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    this._id = props.id;
    this._username = props.username;
    this._password = props.password;
    this._role = props.role;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    return this._password;
  }

  get role(): UserRole {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Setters
  set username(username: string) {
    this._username = username;
    this._updatedAt = new Date();
  }

  set password(password: string) {
    this._password = password;
    this._updatedAt = new Date();
  }

  set role(role: UserRole) {
    this._role = role;
    this._updatedAt = new Date();
  }

  // Métodos de negocio
  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  // Método para convertir la entidad a un objeto plano
  toJSON(): Omit<UserProps, 'password'> {
    return {
      id: this._id,
      username: this._username,
      role: this._role,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
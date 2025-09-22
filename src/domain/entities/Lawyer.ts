/**
 * Entidad Lawyer - Representa un abogado en el sistema
 */
export enum LawyerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface LawyerProps {
  id?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: LawyerStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Lawyer {
  private readonly _id: string | undefined;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _specialization: string;
  private _status: LawyerStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: LawyerProps) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._phone = props.phone;
    this._specialization = props.specialization;
    this._status = props.status;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get specialization(): string {
    return this._specialization;
  }

  get status(): LawyerStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Setters
  set name(name: string) {
    this._name = name;
    this._updatedAt = new Date();
  }

  set email(email: string) {
    this._email = email;
    this._updatedAt = new Date();
  }

  set phone(phone: string) {
    this._phone = phone;
    this._updatedAt = new Date();
  }

  set specialization(specialization: string) {
    this._specialization = specialization;
    this._updatedAt = new Date();
  }

  set status(status: LawyerStatus) {
    this._status = status;
    this._updatedAt = new Date();
  }

  // Métodos de negocio
  activate(): void {
    this._status = LawyerStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._status = LawyerStatus.INACTIVE;
    this._updatedAt = new Date();
  }

  isActive(): boolean {
    return this._status === LawyerStatus.ACTIVE;
  }

  // Método para convertir la entidad a un objeto plano
  toJSON(): LawyerProps {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      phone: this._phone,
      specialization: this._specialization,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
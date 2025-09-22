/**
 * Entidad Lawsuit - Representa una demanda en el sistema
 */
export enum LawsuitCaseType {
  CIVIL = 'civil',
  CRIMINAL = 'criminal',
  LABOR = 'laboral',
  COMMERCIAL = 'comercial'
}

export enum LawsuitStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  RESOLVED = 'resolved'
}

export interface LawsuitProps {
  id?: string;
  caseNumber: string;
  plaintiff: string;
  defendant: string;
  caseType: LawsuitCaseType;
  status: LawsuitStatus;
  lawyerId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Lawsuit {
  private readonly _id: string | undefined;
  private _caseNumber: string;
  private _plaintiff: string;
  private _defendant: string;
  private _caseType: LawsuitCaseType;
  private _status: LawsuitStatus;
  private _lawyerId: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: LawsuitProps) {
    this._id = props.id;
    this._caseNumber = props.caseNumber;
    this._plaintiff = props.plaintiff;
    this._defendant = props.defendant;
    this._caseType = props.caseType;
    this._status = props.status;
    this._lawyerId = props.lawyerId || null;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get caseNumber(): string {
    return this._caseNumber;
  }

  get plaintiff(): string {
    return this._plaintiff;
  }

  get defendant(): string {
    return this._defendant;
  }

  get caseType(): LawsuitCaseType {
    return this._caseType;
  }

  get status(): LawsuitStatus {
    return this._status;
  }

  get lawyerId(): string | null {
    return this._lawyerId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Setters
  set caseNumber(caseNumber: string) {
    this._caseNumber = caseNumber;
    this._updatedAt = new Date();
  }

  set plaintiff(plaintiff: string) {
    this._plaintiff = plaintiff;
    this._updatedAt = new Date();
  }

  set defendant(defendant: string) {
    this._defendant = defendant;
    this._updatedAt = new Date();
  }

  set caseType(caseType: LawsuitCaseType) {
    this._caseType = caseType;
    this._updatedAt = new Date();
  }

  set status(status: LawsuitStatus) {
    this._status = status;
    this._updatedAt = new Date();
  }

  // Métodos de negocio
  assignLawyer(lawyerId: string): void {
    this._lawyerId = lawyerId;
    this._status = LawsuitStatus.ASSIGNED;
    this._updatedAt = new Date();
  }

  resolve(): void {
    this._status = LawsuitStatus.RESOLVED;
    this._updatedAt = new Date();
  }

  isAssigned(): boolean {
    return this._status === LawsuitStatus.ASSIGNED;
  }

  isPending(): boolean {
    return this._status === LawsuitStatus.PENDING;
  }

  isResolved(): boolean {
    return this._status === LawsuitStatus.RESOLVED;
  }

  // Método para convertir la entidad a un objeto plano
  toJSON(): LawsuitProps {
    return {
      id: this._id,
      caseNumber: this._caseNumber,
      plaintiff: this._plaintiff,
      defendant: this._defendant,
      caseType: this._caseType,
      status: this._status,
      lawyerId: this._lawyerId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}
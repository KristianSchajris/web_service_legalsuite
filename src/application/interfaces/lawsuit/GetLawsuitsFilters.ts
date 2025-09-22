import { LawsuitStatus } from '../../../domain/entities/Lawsuit';

export interface GetLawsuitsFilters {
  status?: LawsuitStatus;
  lawyerId?: string;
}
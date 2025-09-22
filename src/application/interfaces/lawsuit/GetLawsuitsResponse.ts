import { LawsuitProps } from '../../../domain/entities/Lawsuit';

export interface GetLawsuitsResponse {
  lawsuits: LawsuitProps[];
  total: number;
  page: number;
  limit: number;
}
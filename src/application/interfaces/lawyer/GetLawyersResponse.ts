import { LawyerProps } from '../../../domain/entities/Lawyer';

export interface GetLawyersResponse {
  lawyers: LawyerProps[];
  total: number;
  page: number;
  limit: number;
}
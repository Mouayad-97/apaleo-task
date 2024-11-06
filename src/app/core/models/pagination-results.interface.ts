import { PaginationData } from './pagination-data.interface';

export interface PaginationResult<M> {
  rs: M[];
  paginationData: PaginationData;
}

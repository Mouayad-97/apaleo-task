import { RecursiveKeys } from '@shared/utils';

export interface FilterOptions<T> {
  key: RecursiveKeys<T> & string;
  value: any;
}

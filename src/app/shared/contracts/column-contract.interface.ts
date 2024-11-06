import { FilterOptions } from '@shared/models';
import { Column, SortOrderType } from '@shared/utils';
import { BehaviorSubject, Subject } from 'rxjs';

export interface ColumnContract<M> {
  config: Column<M>;
  filter: () => BehaviorSubject<FilterOptions<M>>;
  clear: Subject<keyof M>;
  sortBy: keyof M & string;
  order: SortOrderType;
  isActiveSort: boolean;
}

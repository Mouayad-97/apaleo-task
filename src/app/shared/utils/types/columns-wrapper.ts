import { ColumnContract } from '@shared/contracts';
import { FilterOptions } from '@shared/models';
import { BehaviorSubject, Subject } from 'rxjs';
import { SortOrderType, SortOrder } from '../enums';
import { Column } from './column';

export class ColumnsWrapper<M> {
  list: Column<M>[];
  colNames = new Set<keyof M>();
  diplayNames: string[] = [];
  filterNames = new Set<string>();
  filter$!: BehaviorSubject<FilterOptions<M>>;
  clear$ = new Subject<keyof M | void>();
  colsMap: Record<string, ColumnContract<M>> = {};

  constructor(...columns: Column<M>[]) {
    this.list = columns;
    this.initializeColumns(columns);
  }

  private initializeColumns(columns: Column<M>[]) {
    columns.forEach((col) => {
      this.colNames.add(col.name);
      this.diplayNames.push(col.displayName);
      this.filterNames.add(col.filterName);
      this.colsMap[col.filterName] = this.createColumnContract(col);
    });
  }

  private createColumnContract(col: Column<M>): ColumnContract<M> {
    return {
      config: col,
      ...(col.filter ? { filter: () => this.filter$, clear: this.clear$ } : {}),
      ...(col.sortable
        ? { sortBy: col.name, order: 'none', isActiveSort: false }
        : {}),
    } as ColumnContract<M>;
  }

  attachFilter(filter: BehaviorSubject<FilterOptions<M>>): this {
    this.filter$ = filter;
    return this;
  }

  toggleSort(colName: string, order: SortOrderType) {
    this.list.forEach((col) => {
      const columnContract = this.colsMap[col.filterName];
      const isTargetColumn = columnContract.sortBy === colName;
      columnContract.isActiveSort = isTargetColumn && order !== SortOrder.NONE;
      columnContract.order = isTargetColumn ? order : SortOrder.NONE;
    });
  }
}

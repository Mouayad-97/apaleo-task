import { Injectable } from '@angular/core';
import { PaginationResult, PaginationData } from '@core/models';
import { DEFAULT_PAGINATION_DATA } from '@shared/constants';
import { PaginationOptions, FilterOptions, SortOptions } from '@shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseDataTableService<M> {
  constructor() {}

  abstract selectedColumns: Array<keyof M>;

  load(
    paginationOptions: PaginationOptions = {
      skip: DEFAULT_PAGINATION_DATA.SKIP,
      limit: DEFAULT_PAGINATION_DATA.LIMIT,
    },
    filterOptions?: FilterOptions<M>,
    sortOptions?: SortOptions<M>,
    searchToken?: string
  ) {
    filterOptions =
      filterOptions?.key && filterOptions?.value ? filterOptions : undefined;
    return this.requestHandler(
      paginationOptions,
      filterOptions,
      sortOptions,
      searchToken
    );
  }

  abstract requestHandler(
    paginationOptions?: PaginationOptions,
    filterOptions?: FilterOptions<M>,
    sortOptions?: SortOptions<M>,
    searchToken?: string
  ): Observable<PaginationResult<M>>;

  protected handleResponse<
    TResponse extends PaginationData,
    K extends keyof TResponse & string,
    TItem = TResponse[K] extends Array<infer U> ? U : never
  >(
    res: TResponse,
    dataProperty: K,
    mapperFn: (item: TItem) => M
  ): PaginationResult<M> {
    return {
      paginationData: {
        limit: res.limit,
        skip: res.skip,
        total: res.total,
      },
      rs: (res[dataProperty] as Array<TItem>).map((item) => mapperFn(item)),
    };
  }
}

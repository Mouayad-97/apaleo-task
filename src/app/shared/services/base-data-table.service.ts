import { Injectable } from '@angular/core';
import { PaginationResult, PaginationData } from '@core/models';
import { DEFAULT_PAGINATION_DATA } from '@shared/constants';
import { PaginationOptions, FilterOptions, SortOptions } from '@shared/models';
import { getNestedValue } from '@shared/utils';
import { Observable, of } from 'rxjs';

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
  ): ReturnType<typeof this.requestHandler> {
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

  loadDataUI(
    data: M[],
    paginationOptions: PaginationOptions = {
      skip: DEFAULT_PAGINATION_DATA.SKIP,
      limit: DEFAULT_PAGINATION_DATA.LIMIT,
    },
    filterOptions?: FilterOptions<M>[],
    sortOption?: SortOptions<M>
  ): Observable<PaginationResult<M>> {
    let filteredData = data;

    if (filterOptions && filterOptions.length > 0) {
      filteredData = data.filter((item) => {
        for (let { key, value } of filterOptions) {
          const itemValue = getNestedValue(item, key);

          if (typeof itemValue === 'string' && typeof value === 'string') {
            if (!itemValue.includes(value)) return false; // Case-sensitive substring match
          } else if (itemValue !== value) {
            return false; // Exact match for non-strings
          }
        }
        return true; // All filters passed
      });
    }

    let sortedData = filteredData;
    if (sortOption) {
      const { sortBy, order } = sortOption;

      sortedData = [...filteredData].sort((a, b) => {
        const aValue = getNestedValue(a, sortBy);
        const bValue = getNestedValue(b, sortBy);

        // Use early exits for comparison results to improve sort speed
        if (aValue < bValue) return order === 'asc' ? -1 : 1;
        if (aValue > bValue) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const total = sortedData.length;
    const { skip, limit } = paginationOptions;
    const paginatedData = sortedData.slice(skip, skip + limit);

    const paginationData: PaginationData = {
      total,
      skip,
      limit,
    };

    return of({
      rs: paginatedData,
      paginationData,
    });
  }
}

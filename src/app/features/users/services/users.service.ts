import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PaginationResult } from '@core/models';
import { UrlService } from '@core/services';
import { PaginationOptions, FilterOptions, SortOptions } from '@shared/models';
import { BaseDataTableService } from '@shared/services';
import { Observable, map } from 'rxjs';
import { User, UserResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseDataTableService<User> {
  override selectedColumns: (keyof User)[] = [
    'firstName',
    'lastName',
    'age',
    'address',
  ];

  private readonly http = inject(HttpClient);
  private readonly urlService = inject(UrlService);

  constructor() {
    super();
  }

  getAllUsers() {
    const url = this.urlService.URLS.USERS;
    //get all data
    const params = this.buildHttpParams({ limit: 0, skip: 0 });
    return this.http
      .get<UserResponse>(url, { params: params })
      .pipe(
        map((res) =>
          this.handleResponse(res, 'users', (item) => new User(item))
        )
      );
  }

  override requestHandler(
    paginationOptions?: PaginationOptions,
    filterOptions?: FilterOptions<User>,
    sortOptions?: SortOptions<User>,
    searchToken?: string
  ): Observable<PaginationResult<User>> {
    const params = this.buildHttpParams(
      paginationOptions,
      filterOptions,
      sortOptions,
      searchToken
    );
    const url = this.determineUrl(filterOptions, searchToken);
    return this.http
      .get<UserResponse>(url, { params: params })
      .pipe(
        map((res) =>
          this.handleResponse(res, 'users', (item) => new User(item))
        )
      );
  }

  private determineUrl(
    filterOptions?: FilterOptions<User>,
    searchToken?: string
  ): string {
    if (searchToken) {
      return `${this.urlService.URLS.USERS}/search`;
    }
    if (filterOptions) {
      return `${this.urlService.URLS.USERS}/filter`;
    }
    return this.urlService.URLS.USERS;
  }
  private buildHttpParams(
    paginationOptions?: PaginationOptions,
    filterOptions?: FilterOptions<User>,
    sortOptions?: SortOptions<User>,
    searchToken?: string
  ): HttpParams {
    // Create a base HttpParams object with optional parameters
    let params = new HttpParams({
      fromObject: {
        ...paginationOptions,
        ...filterOptions,
        ...sortOptions,
      },
    });

    // Add search token if provided
    if (searchToken) {
      params = params.set('q', searchToken);
    }

    // Add selected columns to the params
    return params.set('select', this.selectedColumns.join(','));
  }
}

import {
  NgClass,
  AsyncPipe,
  NgTemplateOutlet,
  NgOptimizedImage,
} from '@angular/common';
import {
  Component,
  OnInit,
  input,
  inject,
  DestroyRef,
  signal,
  booleanAttribute,
  effect,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ASSETS } from '@core/providers';
import { DEFAULT_PAGINATION_DATA } from '@shared/constants';
import { ApaleoTemplateDirective } from '@shared/directives';
import { SortOptions, FilterOptions, PaginationOptions } from '@shared/models';
import { BaseDataTableService } from '@shared/services';
import { ColumnsWrapper } from '@shared/utils';
import {
  ReplaySubject,
  BehaviorSubject,
  Observable,
  of,
  delay,
  switchMap,
  combineLatest,
  finalize,
  tap,
  map,
  debounceTime,
  skipWhile,
  filter,
} from 'rxjs';
import { ColumnFilterComponent } from '../column-filter';
import { ColumnSorterComponent } from '../column-sorter';
import { InputTextComponent } from '../inputs';
import { PaginatorComponent } from '../paginator';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    PaginatorComponent,
    InputTextComponent,
    ApaleoTemplateDirective,
    ColumnSorterComponent,
    NgClass,
    ColumnFilterComponent,
    AsyncPipe,
    NgTemplateOutlet,
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T> implements OnInit {
  columnsWrapper = input.required<ColumnsWrapper<T>>();

  filterUI = input<boolean>();

  allData = input<T[]>();

  delaySearch = input<number>(250);

  data$ = this.load();

  service = inject<BaseDataTableService<T>>(BaseDataTableService, {
    skipSelf: true,
  });

  assets = inject(ASSETS);

  destroyRef = inject(DestroyRef);

  sort$: ReplaySubject<SortOptions<T> | undefined> = new ReplaySubject<
    SortOptions<T> | undefined
  >(1);

  filter$ = new BehaviorSubject<FilterOptions<T> | FilterOptions<T>[]>(
    {} as FilterOptions<T>
  );

  skip = signal<number>(DEFAULT_PAGINATION_DATA.SKIP);
  limit = signal<number>(DEFAULT_PAGINATION_DATA.LIMIT);
  total = signal<number>(0);

  paginate$ = new BehaviorSubject<PaginationOptions>({
    skip: this.skip(),
    limit: this.limit(),
  });

  search$ = new BehaviorSubject<string>('');

  searchForm = new FormControl<string>('', {
    nonNullable: true,
  });

  loadingSubject$ = new BehaviorSubject<boolean>(false);

  filterUi$ = toObservable(this.filterUI);
  allData$ = toObservable(this.allData);

  ngOnInit(): void {
    //attach filter subject for the columns
    this.columnsWrapper().attachFilter(this.filter$);
    this.sort$.next(undefined);
    this.listenToValueChange();
  }

  private load(): Observable<T[]> {
    return of(undefined)
      .pipe(delay(0))
      .pipe(switchMap(() => this.filterUi$))
      .pipe(filter((isFilterUI) => isFilterUI !== undefined))
      .pipe(
        switchMap((isFilterUI) => {
          return combineLatest([
            of(isFilterUI),
            this.allData$,
            this.paginate$,
            this.filter$,
            this.sort$,
            this.search$,
          ])
            .pipe(
              filter(([isFilterUI, allData]) => {
                return (
                  isFilterUI === false ||
                  (isFilterUI === true &&
                    allData !== null &&
                    allData !== undefined)
                );
              })
            )
            .pipe(
              switchMap(
                ([
                  isFilterUI,
                  allData,
                  paginationOptions,
                  filter,
                  sort,
                  search,
                ]) => {
                  this.loadingSubject$.next(true);
                  if (isFilterUI) {
                    return this.service.loadDataUI(
                      allData!,
                      paginationOptions,
                      filter as FilterOptions<T>[],
                      sort
                    );
                  }
                  return this.service
                    .load(
                      paginationOptions,
                      filter as FilterOptions<T>,
                      sort,
                      search
                    )
                    .pipe(finalize(() => this.loadingSubject$.next(false)));
                }
              ),
              tap(({ paginationData }) => {
                this.total.set(paginationData.total);
                this.loadingSubject$.next(false);
              }),
              map((response) => response.rs)
            );
        })
      );
  }

  sort($event: SortOptions<T>): void {
    this.columnsWrapper().toggleSort($event.sortBy, $event!.order);
    if ($event.sortBy && $event.order !== 'none') {
      this.sort$.next({ sortBy: $event.sortBy, order: $event.order });
    }
  }

  paginate($event: PaginationOptions) {
    this.paginate$.next({
      skip: $event.skip,
      limit: $event.limit,
    });
    this.skip.set($event.skip);
    this.limit.set($event.limit);
  }

  filterChange($event: FilterOptions<T>) {
    const isFilterUIArray = this.filterUI(); // Determine if filterUI is in array mode

    // If the filter value is null, undefined, or an empty string, we need to remove the filter
    if (
      $event.value === null ||
      $event.value === undefined ||
      $event.value === ''
    ) {
      if (isFilterUIArray) {
        // Remove the filter with the matching key from the array
        const newFilters = (this.filter$.value as FilterOptions<T>[]).filter(
          (f) => f.key !== $event.key
        );
        this.filter$.next([...newFilters]); // Update the filter array
      } else {
        // For single filter mode, just delete the value
        delete (this.filter$.value as FilterOptions<T>).value;
        this.filter$.next({ ...this.filter$.value });
      }
      return;
    }

    // Reset paginator and search form on every filter change
    this.resetPaginator();

    if (isFilterUIArray) {
      this.resetSearchForm();
      // When filterUI is true, ensure `filter$` is treated as an array
      const currentFilters = Array.isArray(this.filter$.value)
        ? this.filter$.value
        : [];

      // Update the array by replacing any existing filter with the same key, or adding the new filter
      const updatedFilters = [
        ...currentFilters.filter((f) => f.key !== $event.key), // Exclude the old filter with the same key
        { key: $event.key, value: $event.value }, // Add the new filter
      ];

      this.filter$.next(updatedFilters); // Emit the updated filter array
    } else {
      // If not in array mode, handle as a single filter object
      this.filter$.next({
        key: $event.key,
        value: $event.value,
      });
    }
  }

  private listenToValueChange() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(this.delaySearch()),
        takeUntilDestroyed(this.destroyRef),
        tap((value) => {
          this.search$.next(value);
          // Reset filters if there's a value
          if (value) {
            this.filter$.next({} as FilterOptions<T>);
            this.columnsWrapper().clear$.next();
          }
        })
      )
      .subscribe();
  }

  private resetPaginator() {
    this.updatePaginationDate(
      DEFAULT_PAGINATION_DATA.SKIP,
      DEFAULT_PAGINATION_DATA.LIMIT
    );
    this.paginate$.next({
      limit: this.limit(),
      skip: this.skip(),
    });
  }

  private resetSearchForm() {
    this.searchForm.reset('');
  }

  private updatePaginationDate(newSkip: number, newLimit: number) {
    this.limit.set(newLimit);
    this.skip.set(newSkip);
  }
}

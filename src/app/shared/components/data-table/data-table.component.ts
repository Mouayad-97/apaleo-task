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
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

  filter$ = new BehaviorSubject<FilterOptions<T>>({} as FilterOptions<T>);

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

  ngOnInit(): void {
    //attach filter subject for the columns
    this.columnsWrapper().attachFilter(this.filter$);
    this.sort$.next(undefined);
    this.listenToValueChange();
  }

  private load(): Observable<T[]> {
    return of(undefined)
      .pipe(delay(0)) // need it to make little delay till the userFilter input get bind.
      .pipe(
        switchMap(() => {
          return combineLatest([
            this.paginate$,
            this.filter$,
            this.sort$,
            this.search$,
          ]).pipe(
            switchMap(([paginationOptions, filter, sort, search]) => {
              this.loadingSubject$.next(true);
              return this.service
                .load(paginationOptions, filter, sort, search)
                .pipe(finalize(() => this.loadingSubject$.next(false)));
            }),
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
    if (
      // Comparing value with null only makes a problem when value is 0 (falsy)
      $event.value === null ||
      $event.value === undefined ||
      $event.value === ''
    ) {
      delete this.filter$.value.value;
      this.filter$.next({ ...this.filter$.value });
      return;
    }
    this.resetPaginator();
    this.resetSearchForm();
    this.filter$.next({
      key: $event.key,
      value: $event.value,
    });
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

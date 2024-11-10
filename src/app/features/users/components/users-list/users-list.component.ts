import { AsyncPipe, JsonPipe, NgClass } from '@angular/common';
import {
  Component,
  ComponentRef,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '@features/users/models';
import { UsersService } from '@features/users/services';
import {
  DataTableComponent,
  ColumnSorterComponent,
  InputTextComponent,
  ColumnFilterComponent,
} from '@shared/components';
import { FilterModeComponent } from '@shared/components/filter-mode/filter-mode.component';
import { BaseDataTableService } from '@shared/services';
import { ColumnsWrapper, Column, withFilter, withSort } from '@shared/utils';
import { map, Observable, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    JsonPipe,
    DataTableComponent,
    ColumnSorterComponent,
    NgClass,
    InputTextComponent,
    ColumnFilterComponent,
    AsyncPipe,
  ],
  providers: [{ provide: BaseDataTableService, useExisting: UsersService }],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit {
  private readonly userService = inject(UsersService);
  private readonly destroyRef = inject(DestroyRef);
  filterModeContainer = viewChild.required('filterModeDialog', {
    read: ViewContainerRef,
  });
  private dialogRef!: ComponentRef<FilterModeComponent>;
  filterUI = signal<boolean | undefined>(undefined);

  data$ = new Subject<void>();

  users$ = this.data$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .pipe(switchMap((_) => this.userService.getAllUsers()))
    .pipe(map((res) => res.rs));

  ngOnInit(): void {
    this.openFilterModeDialog();
  }

  columns: ColumnsWrapper<User> = new ColumnsWrapper(
    new Column('firstName', 'First Name', withFilter(), withSort()),
    new Column('lastName', 'Last Name', withFilter(), withSort()),
    new Column('age', 'Age', withSort()),
    new Column('address', 'Adress')
  );

  openFilterModeDialog() {
    this.filterModeContainer().clear();
    this.dialogRef =
      this.filterModeContainer().createComponent(FilterModeComponent);

    this.dialogRef.instance.modeSelection.subscribe((mode) => {
      this.filterUI.set(mode === 'frontend');
      if (mode === 'frontend') {
        this.data$.next();
      }
      this.closeDialog();
    });
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.destroy();
    }
  }
}

import { JsonPipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '@features/users/models';
import { UsersService } from '@features/users/services';
import {
  DataTableComponent,
  ColumnSorterComponent,
  InputTextComponent,
  ColumnFilterComponent,
} from '@shared/components';
import { BaseDataTableService } from '@shared/services';
import { ColumnsWrapper, Column, withFilter, withSort } from '@shared/utils';

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
  ],
  providers: [{ provide: BaseDataTableService, useExisting: UsersService }],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  columns: ColumnsWrapper<User> = new ColumnsWrapper(
    new Column('firstName', 'First Name', withFilter(), withSort()),
    new Column('lastName', 'Last Name', withFilter(), withSort()),
    new Column('age', 'Age', withSort()),
    new Column('address', 'Adress')
  );
}

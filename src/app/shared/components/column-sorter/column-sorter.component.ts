import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { ASSETS } from '@core/providers';
import { ColumnContract } from '@shared/contracts';
import { SortOptions } from '@shared/models';
import { SortOrderType, SortOrder } from '@shared/utils';

@Component({
  selector: 'app-column-sorter',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './column-sorter.component.html',
  styleUrl: './column-sorter.component.scss',
})
export class ColumnSorterComponent<M> {
  assets = inject(ASSETS);
  col = input.required<ColumnContract<M>>();
  onSort = output<SortOptions<M>>();
  dir = signal<SortOrderType>(SortOrder.NONE);

  sort() {
    this.dir.update(() => this.nextSortOrder(this.dir()));
    this.onSort.emit({ order: this.dir(), sortBy: this.col().sortBy });
  }

  private nextSortOrder(currentOrder: SortOrderType): SortOrderType {
    switch (currentOrder) {
      case SortOrder.NONE:
        return SortOrder.ASC;
      case SortOrder.ASC:
        return SortOrder.DESC;
      case SortOrder.DESC:
        return SortOrder.NONE;
    }
  }
}

import { NgTemplateOutlet, NgOptimizedImage } from '@angular/common';
import { Component, input, output, computed, inject } from '@angular/core';
import { ASSETS } from '@core/providers';
import { DEFAULT_PAGE_SIZE_OPTIONS } from '@shared/constants';
import { PaginationOptions } from '@shared/models';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [NgTemplateOutlet, NgOptimizedImage],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  total = input.required<number>();
  skip = input.required<number>();
  limit = input.required<number>();
  pageSizeOptions = input<number[]>(DEFAULT_PAGE_SIZE_OPTIONS);

  onPaginate = output<PaginationOptions>();

  totalPages = computed(() => {
    return this.limit() && this.limit() > 0
      ? Math.ceil(this.total() / this.limit())
      : 0;
  });
  currentPage = computed(() => {
    return this.limit() && this.limit() > 0
      ? Math.floor(this.skip() / this.limit()) + 1
      : 0;
  });

  paginationAction: Record<'NEXT' | 'LAST' | 'PREVIOUS' | 'FIRST', () => void> =
    {
      NEXT: () => this.goToNext(),
      FIRST: () => this.goToFirst(),
      LAST: () => this.goToLast(),
      PREVIOUS: () => this.goToPrevious(),
    };

  assets = inject(ASSETS);

  // Centralized method to update pagination and emit the event
  private updatePagination(newSkip: number, newLimit: number) {
    this.onPaginate.emit({ limit: newLimit, skip: newSkip });
  }

  onPageSizeChange(event: Event) {
    const newSize = Number((event.target as HTMLSelectElement).value);
    this.updatePagination(0, newSize); // Reset to first page on page size change
  }

  private goToFirst() {
    this.updatePagination(0, this.limit());
  }

  private goToPrevious() {
    if (this.currentPage() > 1) {
      this.updatePagination(this.skip() - this.limit(), this.limit());
    }
  }

  private goToNext() {
    if (this.currentPage() < this.totalPages()) {
      this.updatePagination(this.skip() + this.limit(), this.limit());
    }
  }

  private goToLast() {
    const lastPageSkip = (this.totalPages() - 1) * this.limit();
    this.updatePagination(lastPageSkip, this.limit());
  }
}

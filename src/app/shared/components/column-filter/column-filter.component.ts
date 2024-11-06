import { JsonPipe, NgOptimizedImage } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
  DestroyRef,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ASSETS } from '@core/providers';
import { ColumnContract } from '@shared/contracts';
import { ApaleoTemplateDirective } from '@shared/directives';
import { FilterOptions } from '@shared/models';
import { RecursiveKeys } from '@shared/utils';
import { debounceTime } from 'rxjs';
import { InputTextComponent } from '../inputs';

@Component({
  selector: 'app-column-filter',
  standalone: true,
  imports: [
    InputTextComponent,
    ApaleoTemplateDirective,
    ReactiveFormsModule,
    JsonPipe,
    NgOptimizedImage,
  ],
  templateUrl: './column-filter.component.html',
  styleUrl: './column-filter.component.scss',
})
export class ColumnFilterComponent<M> implements OnInit {
  destroyRef = inject(DestroyRef);
  assets = inject(ASSETS);

  col = input.required<ColumnContract<M>>();
  control = new FormControl<string>('', { nonNullable: true });

  filterChange = output<FilterOptions<M>>();

  get filterIcon() {
    return ('' + this.control.value).length
      ? this.assets['filter-clear']
      : this.assets['filter'];
  }

  ngOnInit(): void {
    this.listenToControl();
    this.listenToClearValue();
  }

  private listenToControl() {
    if (!this.col() || !this.col().filter) return;

    this.control.valueChanges
      .pipe(debounceTime(250))
      .subscribe((value: any) => {
        this.col() &&
          this.filterChange.emit({
            key: this.col().config.name as RecursiveKeys<M> & string,
            value,
          });
        this.clearAllFiltersExceptCurrent();
      });
  }

  clear() {
    this.control.dirty && this.control.reset();
  }

  private listenToClearValue() {
    this.col()
      ?.clear.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((name) => {
        if (this.col().config.name !== name) {
          this.control.reset('', { emitEvent: false });
        }
      });
  }

  clearAllFiltersExceptCurrent() {
    this.col()?.clear.next(this.col().config.name);
  }
}

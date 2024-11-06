import { NgClass, NgTemplateOutlet, NgStyle } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewInit,
  AfterContentInit,
  inject,
  DestroyRef,
  ChangeDetectorRef,
  model,
  input,
  contentChildren,
  viewChild,
  ElementRef,
  TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  ControlValueAccessor,
  FormControl,
  NgControl,
  ControlContainer,
} from '@angular/forms';
import { ApaleoTemplateDirective } from '@shared/directives';
import { tap } from 'rxjs';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgTemplateOutlet, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
})
export class InputTextComponent
  implements ControlValueAccessor, OnInit, AfterViewInit, AfterContentInit
{
  onChange!: (value: string | null) => void;
  onTouch!: () => void;

  control = new FormControl('');

  readonly ngContorl = inject(NgControl, { optional: true, self: true });
  readonly controlContainer = inject(ControlContainer, {
    optional: true,
    skipSelf: true,
    host: true,
  });
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _cdr = inject(ChangeDetectorRef);

  value = model<string>();
  disabled = model<boolean>();
  autocomplete = input<boolean>();
  type = input.required<'password' | 'text'>();
  placeholder = input<string>('');
  size = input<'sm' | 'md' | 'lg'>('md');
  label = input<string>('');
  inputId = input<string>();
  klass = input<string>();
  ariaLabel = input<string | null>();
  ariaLabelledBy = input<string | null>();
  inputColor = input<string>('');
  templates = contentChildren<ApaleoTemplateDirective<'prefix' | 'suffix'>>(
    ApaleoTemplateDirective
  );

  prefixWrapper = viewChild<ElementRef<HTMLSpanElement>>('prefixWrapper');
  suffixWrapper = viewChild<ElementRef<HTMLSpanElement>>('suffixWrapper');

  prefixTemplate?: TemplateRef<HTMLElement> | null;
  suffixTemplate?: TemplateRef<HTMLElement> | null;
  prefixPadding: number = 0;
  suffixPadding: number = 0;

  constructor() {
    if (this.ngContorl) this.ngContorl.valueAccessor = this;
  }
  ngAfterViewInit(): void {
    if (this.prefixWrapper()) {
      const prefixWidth = this.prefixWrapper()?.nativeElement?.offsetWidth;
      this.prefixPadding = prefixWidth ? prefixWidth + 20 : 0;
      this._cdr.markForCheck();
    }
    if (this.suffixWrapper()) {
      const suffixWidth = this.suffixWrapper()?.nativeElement?.offsetWidth;
      this.suffixPadding = suffixWidth ? suffixWidth + 20 : 0;
      this._cdr.markForCheck();
    }
  }
  ngAfterContentInit(): void {
    this.templates().forEach((item) => {
      switch (item.getType()) {
        case 'prefix':
          this.prefixTemplate = item.template;
          break;
        case 'suffix':
          this.suffixTemplate = item.template;
      }
    });
  }

  ngOnInit(): void {
    this.controlContainer?.valueChanges
      ?.pipe(
        tap((_status) => {
          this._cdr.markForCheck();
        })
      )
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();

    this.checkDisableState();
  }

  writeValue(value: string): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.checkDisableState();
  }

  setValue(event: Event) {
    if (this.disabled()) return;
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
    this.onTouch();
  }

  private checkDisableState() {
    this.disabled()
      ? this.control.disable({ emitEvent: false })
      : this.control.enable({ emitEvent: false });
  }
}

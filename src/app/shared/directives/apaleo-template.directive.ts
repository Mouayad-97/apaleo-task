import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ApaleoTemplate]',
  standalone: true,
})
export class ApaleoTemplateDirective<TType> {
  name = input.required({ alias: 'ApaleoTemplate' });
  public template = inject<TemplateRef<any>>(TemplateRef);
  constructor() {}

  getType(): TType {
    return this.name() as TType;
  }
}

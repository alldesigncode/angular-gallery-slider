import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[template]',
})
export class GalleryTemplateDirective {
  @Input('template') templateName: string;

  constructor(readonly template: TemplateRef<any>) {
    this.templateName = '';
  }
}

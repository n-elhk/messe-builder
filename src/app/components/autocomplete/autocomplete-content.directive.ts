import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[appAutocompleteContent]',
})
export class AutocompleteContentDirective {
  public tpl = inject(TemplateRef);
}

import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { OptionComponent } from './option/option.component';
import { AutocompleteComponent } from './autocomplete.component';
import { AutocompleteDirective } from './autocomplete.directive';
import { AutocompleteContentDirective } from './autocomplete-content.directive';
import { CommonModule } from '@angular/common';

const components = [
  OptionComponent,
  AutocompleteComponent,
  AutocompleteDirective,
  AutocompleteContentDirective,
];

@NgModule({
  imports: [OverlayModule, CommonModule],
  declarations: [...components],
  exports: [...components],
})
export class AutocompleteModule {}

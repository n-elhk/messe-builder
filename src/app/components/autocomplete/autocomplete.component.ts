import {
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { OptionComponent } from './option/option.component';
import {
  Observable,
  merge,
  switchMap,
  tap,
} from 'rxjs';
import { AutocompleteContentDirective } from './autocomplete-content.directive';

@Component({
  selector: 'app-autocomplete',
  styles: [
    `
      .autocomplete {
        background-color: #fff;
        box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.2);
        width: 100%;
        display: block;
        overflow-y: scroll;
      }
    `,
  ],
  template: `
    <ng-template #root>
      <div class="autocomplete">
        <ng-container *ngTemplateOutlet="content.tpl"></ng-container>
      </div>
    </ng-template>
  `,
  exportAs: 'appAutocomplete',
})
export class AutocompleteComponent {
  @ViewChild('root') public rootTemplate!: TemplateRef<any>;

  @ContentChild(AutocompleteContentDirective, { descendants: true })
  public content!: AutocompleteContentDirective;

  @ContentChildren(OptionComponent, { descendants: true })
  public options!: QueryList<OptionComponent>;

  @Output() onSelect = new EventEmitter<string>();

  public optionsClick(): Observable<string | undefined> {
    return this.options.changes.pipe(
      switchMap((options: OptionComponent[]) => {
        const clicks$ = options.map((option) => option.click$);
        return merge(...clicks$).pipe(
          tap((value) => this.onSelect.emit(value)),
        );
      }),
    );
  }
}

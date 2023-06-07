import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  inject,
} from '@angular/core';
import { Observable, fromEvent, map, tap } from 'rxjs';

@Component({
  selector: 'app-option',
  styles: [
    `
      :host {
        display: block;

        .no-result {
          pointer-events: none;
        }

        .option {
          padding: 10px;
          font-size: 14px;
          cursor: pointer;
          display: block;

          &:hover {
            background-color: lightgrey;
          }
        }
      }
    `,
  ],
  template: `
    <div class="option">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent {
  private host = inject(ElementRef);

  @Input({ required: true }) public value = '';

  public click$!: Observable<string>;

  public ngOnInit(): void {
    this.click$ = fromEvent(this.element, 'click', { passive: true }).pipe(
      map(() => this.value),
    );
  }

  get element() {
    return this.host.nativeElement;
  }
}

import {
  Directive,
  ElementRef,
  Input,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import {
  ConnectionPositionPair,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { AutocompleteComponent } from './autocomplete.component';
import { fromEvent, switchMap, tap, takeUntil, filter, merge } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { untilDestroyed } from 'src/app/common/functions/destroye-ref';

@Directive({
  selector: '[appAutocomplete]',
})
export class AutocompleteDirective {
  @Input({ required: true }) public appAutocomplete!: AutocompleteComponent;

  private untilDestroyed = untilDestroyed();

  private overlayRef: OverlayRef | null = null;

  private ngControl = inject(NgControl);

  private vcr = inject(ViewContainerRef);

  private overlay = inject(Overlay);

  private host = inject<ElementRef<HTMLInputElement>>(ElementRef);

  get control() {
    return this.ngControl.control;
  }

  get origin() {
    return this.host.nativeElement;
  }

  private get overlayConfig() {
    return this.overlay.create({
      width: this.origin.offsetWidth,
      maxHeight: 40 * 3,
      backdropClass: '',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.getOverlayPosition(),
    });
  }

  private get templatePortal() {
    return new TemplatePortal(this.appAutocomplete.rootTemplate, this.vcr);
  }

  public ngOnInit(): void {
    fromEvent(this.origin, 'focus', { passive: true })
      .pipe(
        switchMap(() => {
          if (!this.overlayRef) {
            this.overlayRef = this.overlayConfig;
            this.overlayRef.attach(this.templatePortal);
          }

          return merge(
            overlayClickOutside(this.overlayRef, this.origin).pipe(
              tap(() => this.close())
            ),
            this.appAutocomplete.optionsClick().pipe(
              tap((value) => {
                if (this.control) {
                  this.control.setValue(value);
                }
                this.close();
              }),
              takeUntil(this.overlayRef.detachments())
            )
          );
        }),
        this.untilDestroyed()
      )
      .subscribe();
  }

  private close(): void {
    this.overlayRef?.detach();
    this.overlayRef = null;
  }

  private getOverlayPosition() {
    const positions = [
      new ConnectionPositionPair(
        { originX: 'start', originY: 'bottom' },
        { overlayX: 'start', overlayY: 'top' }
      ),
    ];

    return this.overlay
      .position()
      .flexibleConnectedTo(this.origin)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false);
  }
}

export function overlayClickOutside(
  overlayRef: OverlayRef,
  origin: HTMLElement
) {
  return fromEvent<MouseEvent>(document, 'click').pipe(
    filter((event) => {
      const clickTarget = event.target as HTMLElement;
      const notOrigin = clickTarget !== origin; // the input
      const notOverlay =
        !!overlayRef &&
        overlayRef.overlayElement.contains(clickTarget) === false; // the autocomplete
      return notOrigin && notOverlay;
    }),
    filter(Boolean)
  );
}

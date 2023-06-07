import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const DATE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateValueAccessor),
  multi: true,
};

/**
 * The accessor for writing a value and listening to changes on a date input element
 *
 *  ### Example
 *  `<input type="date" name="myBirthday" ngModel useValueAsDate>`
 */
@Directive({
  selector: 'input[type=date][formControl][formControlName]',
  standalone: true,
  providers: [DATE_VALUE_ACCESSOR],
})
export class DateValueAccessor implements ControlValueAccessor {
  @HostListener('input', ['$event.target.valueAsDate']) onChange = (
    _: any
  ) => {};
  @HostListener('blur', []) onTouched = () => {};

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {}

  writeValue(value: string): void {
    this._renderer.setAttribute(
      this._elementRef.nativeElement,
      'valueAsDate',
      value
    );
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setAttribute(
      this._elementRef.nativeElement,
      'disabled',
      JSON.stringify(isDisabled)
    );
  }
}

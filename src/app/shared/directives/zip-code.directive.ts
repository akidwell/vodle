/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, ElementRef, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ZipCodePipe } from '../pipes/zip-code.pipe';

@Directive({
  selector: '[zip-code]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZipCodeDirective),
      multi: true,
    },
  ],
})
export class ZipCodeDirective implements ControlValueAccessor {
  constructor(protected el: ElementRef, private zipPipe: ZipCodePipe) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const numberPattern = /^[0-9]\d*$/;
    const pattern = /^[a-zA-Z0-9]+$/;
    if (event.key === undefined) {
      event.preventDefault();
      return false;
    }
    if (event.ctrlKey && (event.key === 'C' || event.key === 'V')) {
      return true;
    } else if (
      event.key === 'Tab' ||
      event.key === 'Backspace' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'Delete'
    ) {
      return true;
    } else if (!event.key.match(pattern)) {
      event.preventDefault();
      return false;
    }
    // Prevent typing once max length is reached
    if (this.el.nativeElement.value.replaceAll('-', '').replaceAll(' ', '').match(numberPattern)) {
      if (this.el.nativeElement.selectionStart >= 10) {
        event.preventDefault();
        return false;
      }
      return true;
    } else if (
      !this.el.nativeElement.value.replaceAll('-', '').replaceAll(' ', '').match(numberPattern)
    ) {
      if (this.el.nativeElement.selectionStart >= 7) {
        event.preventDefault();
        return false;
      }
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  @HostListener('input', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change(event: any) {
    const original = event.target.value;
    const target = event.target;
    const posStart = target.selectionStart;
    const posEnd = target.selectionEnd;
    const usBeforeLength = target.value.toString().split('-').length - 1;
    const canBeforeLength = target.value.toString().split(' ').length - 1;
    target.value = this.zipPipe.transform(
      target.value.toString().replaceAll('-', '').replaceAll(' ', '')
    );
    const usLength = target.value.toString().split('-').length - 1;
    const canLength = target.value.toString().split(' ').length - 1;
    let offset = usLength - usBeforeLength + (canLength - canBeforeLength);

    // Handle offset around dash or space
    if (original.indexOf('-') < target.value.indexOf('-') && posStart == 5) {
      offset = 0;
    }
    if (original.indexOf(' ') < target.value.indexOf(' ') && posStart == 3) {
      offset = 0;
    }
    // Handle position to auto adjust for dash or space
    target.selectionStart = +posStart + (posStart + offset < 0 ? 0 : offset);
    target.selectionEnd = +posEnd + (posEnd + offset < 0 ? 0 : offset);
    // Write back a clean version of teh zip code to the model
    this.onChange(target.value === '' ? null : target.value.toString().replaceAll('-', ''));
  }

  public async writeValue(value: any): Promise<void> {
    if (value !== null) {
      this.el.nativeElement.value = this.zipPipe.transform(value?.toString());
    }
  }

  public onChange = (_: any) => {};
  public onTouch = () => {};

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}

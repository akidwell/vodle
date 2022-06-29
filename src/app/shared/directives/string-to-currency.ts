import { NgControl } from '@angular/forms';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MinusSignToParens } from '../pipes/minus-sign.pipe';

@Directive({
  selector: '[string-to-currency]',
})
export class StringToCurrencyDirective {
  @Input() decimalPlaces = 0;
  @Input() allowNegative = true;
  @Input() hideDecimal = false;

  constructor(protected el: ElementRef, private control: NgControl) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.control.value != null) {
        this.el.nativeElement.value = this.formatToDisplayCurrency(this.control.value.toString());
      }
    });
  }

  @HostListener('input', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change(event: any) {
    const target = event.target;
    const posStart = target.selectionStart ?? 0;
    const posEnd = target.selectionEnd ?? 0;
    const beforeLength = target.value.toString().split(',').length - 1;

    if (!this.allowNegative) {
      target.value = target.value.replace(/-/g, '');
    }
    else if (target.value.indexOf('-') >= 1 || target.value.match(/-/g)?.length > 1) {
      // Move minus sign to front & remove extra minus signs
      target.value = '-' + target.value.replace(/-/g, '');
    }
    const value = target.value.replace(/[^0-9.-]+/g, '');
    if (!isNaN(Number(value))) {
      target.value = this.formatToEditCurrency(value);
    }
    else {
      target.value = value;
    }
    // calculcate cursor position
    if (value.startsWith('.')) {
      target.selectionStart = +posStart + (posStart + 1);
      target.selectionEnd = +posEnd + (posEnd + 1);
    }
    else {
      const afterLength = target.value.split(',').length - 1;
      const offset = afterLength - beforeLength;
      target.selectionStart = +posStart + (posStart + offset < 0 ? 0 : offset);
      target.selectionEnd = +posEnd + (posEnd + offset < 0 ? 0 : offset);
    }
    // Update model with clean version
    const clean = target.value.replace(/[^0-9.-]+/g, '');
    this.control.viewToModelUpdate(target.value === '' ? null : isNaN(Number(clean)) ? null : Number(clean));
  }

  @HostListener('blur', ['$event.target'])
  onLeaveEvent(target: HTMLInputElement) {
    if (!target.readOnly) {
      const original = target.value.replace(/[^0-9.]+/g, '');
      // target.value = this.formatToCurrency(target.value);
      this.el.nativeElement.value = this.formatToDisplayCurrency(target.value);
      if (original === '') {
        this.control.reset(target.value);
      }
    }
  }

  @HostListener('focus', ['$event.target'])
  onEnterEvent(target: HTMLInputElement) {
    // Convert Parenthesis to minus sign
    if (!target.readOnly && target.value.charAt(0) === '(') {
      this.el.nativeElement.value = '-' + target.value.replace(/[^,0-9.]+/g, '');
    }
  }

  @HostListener('keydown', ['$event'])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onKeyDown(event: any) {
    if (event.key === undefined) {
      event.preventDefault();
      return false;
    }
    // Handle Backspace around commas
    if (event.keyCode === 8) {
      if (
        event.target.selectionStart > 0 &&
        event.target.selectionStart == event.target.selectionEnd
      ) {
        if (
          event.target.value
            .toString()
            .substring(event.target.selectionStart - 1, event.target.selectionEnd) === ','
        ) {
          event.target.selectionStart -= 1;
          event.target.selectionEnd -= 1;
        }
      }
    }
    // Handle Delete around commas
    if (event.keyCode === 46) {
      if (
        event.target.selectionStart > 0 &&
        event.target.selectionStart == event.target.selectionEnd
      ) {
        if (
          event.target.value
            .toString()
            .substring(event.target.selectionStart + 1, event.target.selectionEnd) === ','
        ) {
          event.target.selectionStart += 1;
          event.target.selectionEnd += 1;
        }
      }
    }
    if (event.keyCode === 110 || event.keyCode === 190) {
      // Handle decimal place
      if (this.decimalPlaces > 0 && !this.control.value.toString().includes('.')) {
        return true;
      }
      event.preventDefault();
      return false;
    } else if (event.keyCode === 109 || event.keyCode === 189) {
      // Handle minus sign
      if (this.allowNegative && !this.control.value.toString().includes('-')) {
        return true;
      }
      event.preventDefault();
      return false;
    } else if (event.ctrlKey && (event.keyCode === 67 || event.keyCode === 86)) {
      return true;
    } else if (
      (event.keyCode >= 48 && event.keyCode <= 57) || // Numbers
      (event.keyCode >= 96 && event.keyCode <= 105) || // KeyPad
      event.keyCode === 9 || // Tab
      event.keyCode === 8 || // BackSpace
      event.keyCode === 37 || // Left Arrow
      event.keyCode === 39 || // Right Arrow
      event.keyCode === 46 // Delete
    ) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  private formatToDisplayCurrency(input: string): string {
    const currencyPipe = new CurrencyPipe('en-US');
    const minusPipe = new MinusSignToParens();
    let formattedValue = '';
    // Clean up value to removes anything not a number or decimal or a leading minus sign
    let value: string = input.slice(0, 1).replace(/[^0-9.-]+/g, '') + input.slice(1).replace(/[^0-9.]+/g, '');
    // If only contains a minus or decimal just clear it out to prevent errors
    if (value.replace('-', '').replace('.', '') === '') {
      value = '';
    }
    // If has a value then format it to USD and add parenthesis if negative
    if (value.length > 0) {
      let decimalLen: number = this.decimalPlaces;
      if (this.hideDecimal) {
        const truncValue = parseFloat(value.toString()).toString();
        if (truncValue.includes('.')) {
          decimalLen = Math.min(
            this.decimalPlaces,
            truncValue.length - truncValue.indexOf('.') - 1
          );
        } else {
          decimalLen = 0;
        }
      }
      const format = '1.' + decimalLen.toString() + '-' + decimalLen.toString();
      const currency = currencyPipe.transform(value, 'USD', '', format);
      formattedValue = minusPipe.transform(currency);
    }
    return formattedValue;
  }

  private formatToEditCurrency(input: string): string {
    const currencyPipe = new CurrencyPipe('en-US');
    let decimalLen = 0;
    const position = input.indexOf('.');
    // Check position of decimal
    if (position >= 0) {
      const test = input.length - 1 - position;
      decimalLen = Math.min(this.decimalPlaces,test);
    }
    const format = '1.' + decimalLen.toString() + '-' + decimalLen.toString();
    let currency = currencyPipe.transform(input, 'USD', '', format);

    if (position > 0 && decimalLen == 0 && this.decimalPlaces > 0) {
      currency = currency + '.';
    }
    return currency ?? '';
  }
}
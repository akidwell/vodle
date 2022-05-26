import { NgControl } from '@angular/forms';

import {
  Directive,
  HostListener
} from '@angular/core';

 @Directive({
   selector: 'input[nullValue]'
 })
export class NullValueDirective {
  constructor(private control: NgControl) {}

    @HostListener('input', ['$event.target'])
  onEvent(target: HTMLInputElement) {
    this.control.viewToModelUpdate((target.value === '') ? null : target.value);
  }
}
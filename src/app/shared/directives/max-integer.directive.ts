import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, UntypedFormControl } from '@angular/forms';

@Directive({
  selector: 'input[maxInt]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxIntegerValidator), multi: true }
  ]
})
export class MaxIntegerValidator {

  validate(c: UntypedFormControl) {
    const value = Number(c.value?.toString().replace(/[^0-9.-]+/g, ''));
    if (Number.isNaN(value)){
      return null;
    }
    return value <= 2147483647 && value >= -2147483647 ? null : {
      validateMaxInteger: {
        valid: false
      }
    };
  }
}
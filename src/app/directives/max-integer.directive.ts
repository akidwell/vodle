import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, FormControl } from '@angular/forms';

@Directive({
    selector: 'input[maxInt]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => MaxIntegerValidator), multi: true }
    ]
})
export class MaxIntegerValidator {

    constructor() { }

    validate(c: FormControl) {
        return c.value <= 2147483647 && c.value >= -2147483647 ? null : {
            validateMaxInteger: {
                valid: false
            }
        };
    }
}
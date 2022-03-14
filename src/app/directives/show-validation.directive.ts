import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: 'input[showValidation]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => ShowValidation), multi: true }
    ]
})
export class ShowValidation {
    @Input() isValid: boolean = true;

    constructor() { }
    
    validate() {
        return this.isValid ? null : {
            validate: {
                valid: false
            }
        };
    }
}
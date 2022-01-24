import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, FormControl } from '@angular/forms';

@Directive({
    selector: 'input[dateRange]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateRangeValidator), multi: true }
    ]
})
export class DateRangeValidator {
    @Input() minDate?: Date;
    @Input() maxDate?: Date;
    
    constructor() { }

    validate(c: FormControl) {
        var parsedDate = Date.parse(c.value);
        if (!isNaN(parsedDate)) {
            var date = c.value.toString().split('-');
            var newYear = parseInt(date[0]);
            var month = parseInt(date[1]) - 1; 
            var day = parseInt(date[2]);
            var test = new Date(newYear, month, day, 0, 0, 0, 0)

            return ((this.minDate == null) || test >= this.minDate) && ((this.maxDate == null) || test <= this.maxDate) ? null : {
                validateMaxInteger: {
                    valid: false
                }
            };
        }
        return  {
            validateMaxInteger: {
                valid: false
            }
        };
    }
}
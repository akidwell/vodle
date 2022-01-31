import { NgControl } from "@angular/forms";

import {
    Directive,
    HostListener
} from "@angular/core";

@Directive({
    selector: 'input[string-to-date]'
})
export class StringToDateDirective {
    constructor(private control: NgControl) { }

    @HostListener('input', ['$event.target'])
    onEvent(target: HTMLInputElement) {
        var parsedDate = Date.parse(target.value);
        if (!isNaN(parsedDate)) {
            var date = target.value.toString().split('-');
            var newYear = parseInt(date[0]);
            if (newYear >= 1900) {
                var month = parseInt(date[1]) - 1;
                var day = parseInt(date[2]);
                this.control.viewToModelUpdate(new Date(newYear, month, day, 0, 0, 0, 0));
            }
        }
        
    }

    @HostListener('blur', ['$event.target'])
    onLeaveEvent(target: HTMLInputElement) {
        var parsedDate = Date.parse(target.value);
        if (!isNaN(parsedDate)) {
            var date = target.value.toString().split('-');
            var newYear = parseInt(date[0]);
            if (newYear < 100) {
                newYear += 2000
                var month = parseInt(date[1]) - 1;
                var day = parseInt(date[2]);
                const newDate = new Date(newYear, month, day, 0, 0, 0, 0);
                this.control.reset(newDate.toISOString().slice(0, 10));
                this.control.viewToModelUpdate(newDate);
            }
        }
    }
}
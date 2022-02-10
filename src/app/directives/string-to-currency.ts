import { NgControl } from "@angular/forms";

import {
   Directive,
   HostListener,
   Input
} from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { MinusSignToParens } from "../pipes/minus-sign.pipe";

@Directive({
   selector: 'input[string-to-currency]'
})
export class StringToCurrencyDirective {
   @Input() decimalPlaces: number = 0;
   @Input() allowNegative: boolean = true;
   @Input() hideDecimal: boolean = false;

   currentValue: string = "";

   constructor(private control: NgControl) { }

   ngAfterViewInit(): void {
      setTimeout(() => {
         if (this.control.value != null) {
         this.control.viewToModelUpdate(this.formatToCurrency(this.control.value.toString()));
         }
      });
   }

   @HostListener('input', ['$event.target'])
   onEvent(target: HTMLInputElement) {
      this.control.viewToModelUpdate((target.value === '') ? null : isNaN(Number(target.value)) ? Number(target.value.replace(/[^0-9.-]+/g, "")) : Number(target.value));
   }

   @HostListener('blur', ['$event.target'])
   onLeaveEvent(target: HTMLInputElement) {
      this.control.viewToModelUpdate(this.formatToCurrency(target.value.toString()));
      if (this.currentValue != target.value) {
         this.control.control?.parent?.markAsDirty();
         this.control.control?.parent?.markAsTouched();   
      }
      this.currentValue = "";
   }

   @HostListener('focus', ['$event.target'])
   onEnterEvent(target: HTMLInputElement) {
      this.currentValue = target.value;
      // Convert Parenthesis to minus sign
      if (target.value.charAt(0) === '(') {
         this.control.reset('-' + target.value.replace(/[^0-9.-]+/g, ""));
      }
   }

   @HostListener('keydown', ['$event'])
   onKeyDown(event: any) {
      if (event.keyCode === 190) { // Handle deciamal place
         if (this.decimalPlaces > 0 && !this.control.value.toString().includes(".")) {
            return true;
         }
         event.preventDefault();
         return false;
      }
      else if (event.keyCode === 189) {  // Handle minus sign
         if (this.allowNegative && !this.control.value.toString().includes("-")) {
            return true;
         }
         event.preventDefault();
         return false;
      }
      else if (event.ctrlKey && (event.keyCode === 67 || event.keyCode === 86)) {
         return true;
      }
      else if ((event.keyCode < 48 || event.keyCode > 57) // Prevent anything but numbers
         && event.keyCode !== 9   // Tab
         && event.keyCode !== 8   // BackSpace
         && event.keyCode !== 37  // Left Arrow
         && event.keyCode !== 39  // Right Arrow
         && event.keyCode !== 46  // Delete
      ) {
         event.preventDefault();
         return false;
      } else {
         return true;
      }
   }

   private formatToCurrency(input: string): number | null {
      const currencyPipe = new CurrencyPipe('en-US');
      const minusPipe = new MinusSignToParens();
      let formattedValue = "";
      // Clean up value to removes anything not a number or decimal or minus sign
      let value: string = input.slice(0, 1).replace(/[^0-9.-]+/g, "") + input.slice(1).replace(/[^0-9.]+/g, "");
      // If only contains a minus or decimal just clear it out to prevent errors
      if (value === "-" || value === ".") {
         value = "";
      }
      if (!this.allowNegative) {
         value = value.replace("-", "");
      }
      // If has a value then format it to USD and add parenthesis if negative 
      if (value.length > 0) {
         let decimalLen: number = this.decimalPlaces;
         if (this.hideDecimal) {
            const truncValue = parseFloat(value.toString()).toString();
            if (truncValue.includes(".")) {
               decimalLen = Math.min(this.decimalPlaces, truncValue.length - truncValue.indexOf(".") - 1);
            }
            else {
               decimalLen = 0;
            }
         }
         const format = "1." + decimalLen.toString() + "-" + decimalLen.toString();
         const currency = currencyPipe.transform(value, "USD", "", format);
         formattedValue = minusPipe.transform(currency);
      }
     
      // Display first with parenthesis if negative
      this.control.reset(formattedValue);
      return (value === '') ? null : isNaN(Number(value)) ? Number(value.replace(/[^0-9.-]+/g, "")) : Number(value);
   }

}
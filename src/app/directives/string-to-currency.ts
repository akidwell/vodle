import { NgControl } from "@angular/forms";

 import {
    Directive,
    HostListener
 } from "@angular/core";
 
 @Directive({
    selector: 'input[string-to-currency]'
 })
 export class StringToCurrencyDirective {
    constructor(private control: NgControl) {}
 
    @HostListener('input', ['$event.target'])
    onEvent(target: HTMLInputElement) {
      this.control.viewToModelUpdate((target.value === '') ? null : isNaN(Number(target.value)) ? Number(target.value.replace(/[^0-9.-]+/g,"")) : target.value);
    }
 }
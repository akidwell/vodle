import { NgModule } from '@angular/core';
import { ClickStopPropagation } from './click-stop-propagation.directive';
import { HoverClassDirective } from './hover-class.directive';
import { MaxIntegerValidator } from './max-integer.directive';
import { NullValueDirective } from './null-value.directive';
import { PreventDoubleClickDirective } from './prevent-double-click.directive';
import { StringToCurrencyDirective } from './string-to-currency';

@NgModule({
  imports: [],
  declarations: [
    NullValueDirective,
    MaxIntegerValidator,
    StringToCurrencyDirective,
    ClickStopPropagation,
    PreventDoubleClickDirective,
    HoverClassDirective
  ],
  exports: [
    NullValueDirective,
    MaxIntegerValidator,
    StringToCurrencyDirective,
    ClickStopPropagation,
    PreventDoubleClickDirective,
    HoverClassDirective
  ]
})
export class DirectivesModule { }
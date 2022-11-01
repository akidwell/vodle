import { NgModule } from '@angular/core';
import { ZipCodePipe } from '../pipes/zip-code.pipe';
import { AutofocusDirective } from './autofocus.directive';
import { ClickStopPropagation } from './click-stop-propagation.directive';
import { DomChangeDirective } from './dom-change-directive';
import { HoverClassDirective } from './hover-class.directive';
import { MaxIntegerValidator } from './max-integer.directive';
import { NullValueDirective } from './null-value.directive';
import { PreventDoubleClickDirective } from './prevent-double-click.directive';
import { StringToCurrencyDirective } from './string-to-currency';
import { ValidateOnChangeDirective } from './validate-on-change';
import { ZipCodeValidator } from './zip-code-validate.directive';
import { ZipCodeDirective } from './zip-code.directive';

@NgModule({
  imports: [],
  declarations: [
    NullValueDirective,
    MaxIntegerValidator,
    StringToCurrencyDirective,
    ValidateOnChangeDirective,
    ClickStopPropagation,
    PreventDoubleClickDirective,
    HoverClassDirective,
    AutofocusDirective,
    ZipCodeDirective,
    ZipCodeValidator,
    DomChangeDirective
  ],
  exports: [
    NullValueDirective,
    MaxIntegerValidator,
    StringToCurrencyDirective,
    ValidateOnChangeDirective,
    ClickStopPropagation,
    PreventDoubleClickDirective,
    HoverClassDirective,
    AutofocusDirective,
    ZipCodeDirective,
    ZipCodeValidator,
    DomChangeDirective
  ],
  providers: [ZipCodePipe]
})
export class DirectivesModule {}

import { NgModule } from "@angular/core";
import { ClickStopPropagation } from "./click-stop-propagation.directive";
import { DateRangeValidator } from "./date-range";
import { MaxIntegerValidator } from "./max-integer.directive";
import { NullValueDirective } from "./null-value.directive";
import { StringToCurrencyDirective } from "./string-to-currency";
import { StringToDateDirective } from "./string-to-date";

@NgModule({
    imports: [],
    declarations: [
        NullValueDirective,
        MaxIntegerValidator,
        StringToCurrencyDirective,
        ClickStopPropagation,
        StringToDateDirective,
        DateRangeValidator
    ],
    exports: [
        NullValueDirective,
        MaxIntegerValidator,
        StringToCurrencyDirective,
        ClickStopPropagation,
        StringToDateDirective,
        DateRangeValidator
    ]
})
export class DirectivesModule { }
import { NgModule } from "@angular/core";
import { ClickStopPropagation } from "./click-stop-propagation.directive";
import { MaxIntegerValidator } from "./max-integer.directive";
import { NullValueDirective } from "./null-value.directive";
import { StringToCurrencyDirective } from "./string-to-currency";

@NgModule({
    imports: [],
    declarations: [
        NullValueDirective,
        MaxIntegerValidator,
        StringToCurrencyDirective,
        ClickStopPropagation
    ],
    exports: [
        NullValueDirective,
        MaxIntegerValidator,
        StringToCurrencyDirective,
        ClickStopPropagation
    ]
})
export class DirectivesModule { }
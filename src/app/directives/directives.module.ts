import { NgModule } from "@angular/core";
import { ClickStopPropagation } from "./click-stop-propagation.directive";
import { ShowValidation } from "./limit-validation.directive";
import { MaxIntegerValidator } from "./max-integer.directive";
import { NullValueDirective } from "./null-value.directive";
import { StringToCurrencyDirective } from "./string-to-currency";

@NgModule({
    imports: [],
    declarations: [
        NullValueDirective,
        MaxIntegerValidator,
        StringToCurrencyDirective,
        ClickStopPropagation,
        ShowValidation
    ],
    exports: [
        NullValueDirective,
        MaxIntegerValidator,
        StringToCurrencyDirective,
        ClickStopPropagation,
        ShowValidation
    ]
})
export class DirectivesModule { }
import { NgModule } from "@angular/core";
import { ClickStopPropagation } from "./click-stop-propagation.directive";
import { ShowValidation } from "./show-validation.directive";
import { MaxIntegerValidator } from "./max-integer.directive";
import { NullValueDirective } from "./null-value.directive";
import { PreventDoubleClickDirective } from "./prevent-double-click.directive";
import { StringToCurrencyDirective } from "./string-to-currency";

@NgModule({
    imports: [],
    declarations: [
        NullValueDirective,
        MaxIntegerValidator,
        StringToCurrencyDirective,
        ClickStopPropagation,
        ShowValidation,
        PreventDoubleClickDirective
    ],
    exports: [
        NullValueDirective,
        MaxIntegerValidator,
        StringToCurrencyDirective,
        ClickStopPropagation,
        ShowValidation,
        PreventDoubleClickDirective
    ]
})
export class DirectivesModule { }
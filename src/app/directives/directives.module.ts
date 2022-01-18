import { NgModule } from "@angular/core";
import { MaxIntegerValidator } from "./max-integer.directive";
import { NullValueDirective } from "./null-value.directive";

@NgModule({
    imports: [],
    declarations: [
        NullValueDirective,
        MaxIntegerValidator
    ],
    exports: [
        NullValueDirective,
        MaxIntegerValidator
    ]
})
export class DirectivesModule { }
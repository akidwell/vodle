import { NgModule } from '@angular/core';
import { MinusSignToParens } from './minus-sign.pipe';
import { ZipCodePipe } from './zip-code.pipe';

@NgModule({
  imports: [],
  declarations: [
    ZipCodePipe,
    MinusSignToParens,
  ],
  exports: [
    ZipCodePipe,
    MinusSignToParens
  ]
})
export class PipesModule { }
import { NgModule } from '@angular/core';
import { FeinPipe } from './fein.pipe';
import { MinusSignToParens } from './minus-sign.pipe';
import { ZipCodePipe } from './zip-code.pipe';

@NgModule({
  imports: [],
  declarations: [
    ZipCodePipe,
    FeinPipe,
    MinusSignToParens,
  ],
  exports: [
    ZipCodePipe,
    FeinPipe,
    MinusSignToParens
  ]
})
export class PipesModule { }
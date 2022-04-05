import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuredRoutingModule } from './insured-routing.module';
import { InsuredComponent } from './insured.component';
import { AdditionalNamedInsuredModule } from '../shared/components/additional-named-insured/additional-named-insured.module';


@NgModule({
  declarations: [InsuredComponent],
  imports: [
    CommonModule,
    InsuredRoutingModule,
    AdditionalNamedInsuredModule
  ]
})
export class InsuredModule { }
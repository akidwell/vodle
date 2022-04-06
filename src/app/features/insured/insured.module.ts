import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuredRoutingModule } from './insured-routing.module';
import { AdditionalNamedInsuredModule } from '../../shared/components/additional-named-insured/additional-named-insured.module';
import { InsuredComponent } from './components/insured.component';

@NgModule({
  declarations: [InsuredComponent],
  imports: [
    CommonModule,
    InsuredRoutingModule,
    AdditionalNamedInsuredModule
  ]
})
export class InsuredModule { }
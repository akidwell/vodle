import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../../directives/directives.module';
import { PropertyPremiumDeductibleComponent } from './property-premium-deductible/property-premium-deductible.component';
import { PropertyPremiumDeductibleGroupComponent } from './property-premium-deductible-group/property-premium-deductible-group.component';

@NgModule({
  declarations: [PropertyPremiumDeductibleComponent,
    PropertyPremiumDeductibleGroupComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule
  ],
  exports: [PropertyPremiumDeductibleGroupComponent]
})
export class PropertyPremiumDeductibleModule { }

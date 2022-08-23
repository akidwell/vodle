import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../../directives/directives.module';
import { PropertyDeductibleComponent } from './property-deductible/property-deductible.component';
import { PropertyDeductibleGroupComponent } from './property-deductible-group/property-deductible-group.component';

@NgModule({
  declarations: [PropertyDeductibleComponent,
    PropertyDeductibleGroupComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule
  ],
  exports: [PropertyDeductibleGroupComponent]
})
export class PropertyDeductibleModule { }

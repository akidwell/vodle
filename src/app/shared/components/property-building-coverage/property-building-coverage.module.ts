import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../../directives/directives.module';
import { PropertyBuildingCoverageGroupComponent } from './property-building-coverage-group/property-building-coverage-group.component';
import { PropertyBuildingCoverageComponent } from './property-building-coverage/property-building-coverage.component';
import { provideEnvironmentNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [PropertyBuildingCoverageComponent,
    PropertyBuildingCoverageGroupComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule
  ],
  exports: [PropertyBuildingCoverageGroupComponent],
  providers:[provideEnvironmentNgxMask()]
})
export class PropertyBuildingCoverageModule { }

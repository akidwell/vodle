import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../../directives/directives.module';
import { PropertyBuildingComponent } from './property-building/property-building.component';
import { PropertyBuildingGroupComponent } from './property-building-group/property-building-group.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { provideEnvironmentNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [PropertyBuildingComponent,
    PropertyBuildingGroupComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule,
    MatSlideToggleModule
  ],
  exports: [PropertyBuildingGroupComponent],
  providers:[provideEnvironmentNgxMask()]
})
export class PropertyBuildingModule { }

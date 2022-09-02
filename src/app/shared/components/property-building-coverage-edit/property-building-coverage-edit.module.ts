import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../../directives/directives.module';
import { NgxMaskModule } from 'ngx-mask';
import { PropertyBuildingCoverageEditDialogComponent } from './property-building-coverage-edit-dialog/property-building-coverage-group-edit-dialog.component';
import { PropertyBuildingCoverageEditComponent } from '../property-building-coverage-edit/property-building-coverage-edit/property-building-coverage-edit.component';

@NgModule({
  declarations: [PropertyBuildingCoverageEditComponent,
    PropertyBuildingCoverageEditDialogComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule,
    NgxMaskModule.forRoot()
  ],
  exports: [PropertyBuildingCoverageEditComponent]
})
export class PropertyBuildingCoverageEditModule { }

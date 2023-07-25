import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { FilteredBuildingsService } from 'src/app/shared/services/filtered-buildings/filtered-buildings.service';
import { PropertyDetailLeftComponent } from './property-detail-left/property-detail-left.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { PropertyDetailComponent } from './property-detail.component';
import { PropertyDetailRightComponent } from './property-detail-right/property-detail-right.component';


@NgModule({
  declarations: [
    PropertyDetailComponent,
    PropertyDetailLeftComponent,
    PropertyDetailRightComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    DirectivesModule,
    NgSelectModule,
    PipesModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideEnvironmentNgxMask(),
    DatePipe,
    FormatDateForDisplay,
    ConfirmationDialogService,
    FilteredBuildingsService
  ],
  exports: [
    PropertyDetailComponent,
    PropertyDetailLeftComponent,
    PropertyDetailRightComponent,]

})
export class PropertyDetailModule { }

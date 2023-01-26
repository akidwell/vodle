import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../../directives/directives.module';
import { MortgageeGroupComponent } from './property-mortgagee-group/mortgagee-group.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DATE_FORMATS } from 'src/app/core/constants/date-format';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { CanDeactivateGuard } from 'src/app/features/policy/guards/can-deactivate-guard';
import { AdditionalInterestModule } from '../property-additional-interest.ts/additional-interest.module';
import { MortgageeComponent } from './property-mortgagee/mortgagee.component';





@NgModule({
  declarations: [
    MortgageeComponent,
    MortgageeGroupComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule,
    DragDropModule,
    MatSlideToggleModule,
    AdditionalInterestModule
  ],
  providers: [
    CanDeactivateGuard,
    DatePipe,
    ConfirmationDialogService,
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
  ],
  exports: [MortgageeGroupComponent]
})
export class MortgageeModule { }

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SubmissionRoutingModule } from './submission-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { BusyModule } from 'src/app/core/components/busy/busy.module';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { SubmissionComponent } from './components/submission-base/submission.component';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from 'src/app/core/constants/date-format';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { EndorsementStoredValues } from '../policy/services/endorsement-stored-values/endorsement-stored-values.service';
import { SubmissionInformationModule } from 'src/app/shared/components/submission-information/submission-information.module';
import { SubmissionInfoBaseComponent } from './components/submission-info-base/submission-info-base.component';
import { provideEnvironmentNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    SubmissionComponent,
    SubmissionInfoBaseComponent
  ],
  imports: [
    CommonModule,
    SubmissionRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    NgSelectModule,
    DirectivesModule,
    BusyModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    PipesModule,
    SubmissionInformationModule
  ],
  providers: [
    provideEnvironmentNgxMask(),
    CanDeactivateGuard,
    DatePipe,
    FormatDateForDisplay,
    EndorsementStoredValues,
    ConfirmationDialogService,
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
  ]
})
export class SubmissionModule { }

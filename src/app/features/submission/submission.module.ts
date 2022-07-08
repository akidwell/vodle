import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SubmissionRoutingModule } from './submission-routing.module';
import { AdditionalNamedInsuredModule } from '../../shared/components/additional-named-insured/additional-named-insured.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { BusyModule } from 'src/app/core/components/busy/busy.module';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { SubmissionComponent } from './components/submission-base/submission.component';
import { SubmissionHeaderComponent } from './components/submission-header/submission-header.component';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from 'src/app/core/constants/date-format';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { EndorsementStoredValues } from '../policy/services/endorsement-stored-values/endorsement-stored-values.service';
import { SubmissionInformationComponent } from './components/submission-information/submission-information.component';
import { SubmissionInfoPanelLeftComponent } from './components/submission-info-panel-left/submission-info-panel-left.component';
import { SubmissionInfoPanelRightComponent } from './components/submission-info-panel-right/submission-info-panel-right.component';
import { ProducerSearchModule } from 'src/app/shared/components/producer-search/producer-search.module';
import { ProducerContactSearchModule } from 'src/app/shared/components/producer-contact-search/producer-contact-search.module';

@NgModule({
  declarations: [
    SubmissionComponent,
    SubmissionHeaderComponent,
    SubmissionInformationComponent,
    SubmissionInfoPanelLeftComponent,
    SubmissionInfoPanelRightComponent
  ],
  imports: [
    CommonModule,
    SubmissionRoutingModule,
    AdditionalNamedInsuredModule,
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
    ProducerSearchModule,
    ProducerContactSearchModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
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

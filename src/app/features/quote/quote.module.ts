import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { QuoteRoutingModule } from './quote-routing.module';
import { QuoteComponent } from './components/quote-base/quote.component';
import { QuoteInformationComponent } from './components/quote-information-base/quote-information.component';
import { CanDeactivateGuard } from '../policy/guards/can-deactivate-guard';
import { NgxMaskModule } from 'ngx-mask';
import { QuoteNotFoundComponent } from './components/quote-not-found/quote-not-found.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BusyModule } from 'src/app/core/components/busy/busy.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { QuoteHeaderComponent } from './components/quote-header/quote-header.component';
import { QuoteInformationDetailComponent } from './components/quote-information-detail/quote-information-detail.component';
import { QuoteInformationDetailProgramComponent } from './components/quote-information-detail-program/quote-information-detail-program.component';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from 'src/app/core/constants/date-format';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { QuotePropertyDetailComponent } from './components/quote-property-detail/quote-property-detail.component';
import { QuoteMortgageeComponent } from './components/quote-mortgagee/quote-mortgagee.component';
import { QuotePremiumComponent } from './components/quote-premium/quote-premium.component';
import { QuoteTermsConditionsComponent } from './components/quote-terms-conditions/quote-terms-conditions.component';
import { QuoteSummaryComponent } from './components/quote-summary/quote-summary.component';
import { QuoteSubmissionComponent } from './components/quote-submission/quote-submission.component';
import { SubmissionInformationModule } from 'src/app/shared/components/submission-information/submission-information.module';


@NgModule({
  declarations: [
    QuoteComponent,
    QuoteInformationComponent,
    QuoteNotFoundComponent,
    QuoteHeaderComponent,
    QuoteInformationDetailComponent,
    QuoteInformationDetailProgramComponent,
    QuotePropertyDetailComponent,
    QuoteMortgageeComponent,
    QuotePremiumComponent,
    QuoteTermsConditionsComponent,
    QuoteSummaryComponent,
    QuoteSubmissionComponent ],
  imports: [
    CommonModule,
    QuoteRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    NgSelectModule,
    DirectivesModule,
    BusyModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    SubmissionInformationModule,
    PipesModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    CanDeactivateGuard,
    DatePipe,
    FormatDateForDisplay,
    ConfirmationDialogService,
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
  ]
})
export class QuoteModule { }

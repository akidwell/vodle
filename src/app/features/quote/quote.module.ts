import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { QuoteRoutingModule } from './quote-routing.module';
import { QuoteComponent } from './components/common/quote-base/quote.component';
import { QuoteInformationComponent } from './components/common/quote-information-base/quote-information.component';
import { NgxMaskModule } from 'ngx-mask';
import { QuoteNotFoundComponent } from './components/common/quote-not-found/quote-not-found.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BusyModule } from 'src/app/core/components/busy/busy.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { QuoteHeaderComponent } from './components/common/quote-header/quote-header.component';
import { QuoteInformationDetailComponent } from './components/common/quote-information-detail/quote-information-detail.component';
import { QuoteInformationDetailProgramComponent } from './components/common/quote-information-detail-program/quote-information-detail-program.component';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DATE_FORMATS } from 'src/app/core/constants/date-format';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { QuotePropertyDetailComponent } from './components/property/quote-property-detail/quote-property-detail.component';
import { QuoteSubmissionComponent } from './components/common/quote-submission-base/quote-submission.component';
import { SubmissionInformationModule } from 'src/app/shared/components/submission-information/submission-information.module';
import { QuoteProgramBaseComponent } from './components/quote-program-base/quote-program-base.component';
import { QuotePropertyLocationCoverageComponent } from './components/property/quote-property-location-coverage/quote-property-location-coverage.component';
import { TermsConditionsComponent } from './components/common/terms-conditions-base/terms-conditions.component';
import { QuoteSummaryComponent } from './components/common/quote-summary-base/quote-summary.component';
import { QuotePremiumComponent } from './components/common/quote-premium-base/quote-premium.component';
import { QuotePropertyPremiumComponent } from './components/property/quote-property-premium/quote-property-premium.component';
import { PropertyDeductibleModule } from 'src/app/shared/components/property-deductible/property-deductible.module';
import { PropertyPremiumRateComponent } from './components/property/quote-property-premium-rate/property-premium-rate.component';
import { MortgageeModule } from 'src/app/shared/components/propertry-mortgagee/mortgagee.module';
import { AdditionalInterestModule } from 'src/app/shared/components/property-additional-interest.ts/additional-interest.module';
import { QuoteDataValidationService } from './services/quote-data-validation-service/quote-data-validation-service.service';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { PropertyBuildingModule } from 'src/app/shared/components/property-building/property-building.module';
import { PropertyBuildingCoverageModule } from 'src/app/shared/components/property-building-coverage/property-building-coverage.module';
import { QuotePropertyDetailLeftComponent } from './components/property/quote-property-detail/quote-property-detail-left/quote-property-detail-left.component';
import { QuotePropertyDetailRightComponent } from './components/property/quote-property-detail/quote-property-detail-right/quote-property-detail-right.component';
import { QuotePropertyMortgageeComponent } from './components/property/quote-property-mortgagee/quote-property-mortgagee.component';
import { CanDeactivateChildGuard } from './guards/can-deactivate-child-guard';
import { OptionalPremiumModule } from 'src/app/shared/components/optional-premium/optional-premium.module';
import { PropertyBuildingCoverageEditModule } from 'src/app/shared/components/property-building-coverage-edit/property-building-coverage-edit.module';
import { QuoteFormsComponent } from './components/common/quote-forms-base/quote-forms.component';
import { QuoteLineItemsModule } from './components/common/quote-line-items/quote-line-items.module';
import { PolicyFormsModule } from 'src/app/shared/components/policy-forms/policy-forms.module';
import { PropertyImportModule } from 'src/app/shared/components/property-import/property-import.module';
import { SubjectivitiesModule } from 'src/app/shared/components/subjectivities/subjectivities.module';
import { DisclaimersModule } from 'src/app/shared/components/disclaimers/disclaimers.module';
import { QuoteSummaryCoveragesDetailComponent } from './components/common/quote-summary-coverages-detail/quote-summary-coverages-detail.component';
import { QuoteSummarySubmissionInfoComponent } from './components/common/quote-summary-submission-info/quote-summary-submission-info.component';
import { QuoteSummaryQuoteBindComponent } from './components/common/quote-summary-quote-bind/quote-summary-quote-bind.component';
import { QuoteSummaryPremiumDetailComponent } from './components/common/quote-summary-premium-detail/quote-summary-premium-detail.component';
import { WarrantiesModule } from 'src/app/shared/components/warranties/warranties.module';
import { GeneralRemarksModule } from 'src/app/shared/components/general-remarks/general-remarks.module';
import { InternalNotesModule } from 'src/app/shared/components/internal-notes/internal-notes.module';

@NgModule({
  declarations: [
    QuoteComponent,
    QuoteInformationComponent,
    QuoteNotFoundComponent,
    QuoteHeaderComponent,
    QuoteInformationDetailComponent,
    QuoteInformationDetailProgramComponent,
    QuotePropertyDetailComponent,
    QuotePremiumComponent,
    TermsConditionsComponent,
    QuoteSummaryComponent,
    QuoteSummaryCoveragesDetailComponent,
    QuoteSummarySubmissionInfoComponent,
    QuoteSummaryQuoteBindComponent,
    QuoteSummaryPremiumDetailComponent,
    QuoteSubmissionComponent,
    QuoteProgramBaseComponent,
    QuotePropertyLocationCoverageComponent,
    QuotePropertyPremiumComponent,
    PropertyPremiumRateComponent,
    QuotePropertyDetailLeftComponent,
    QuotePropertyDetailRightComponent,
    QuotePropertyMortgageeComponent,
    QuoteFormsComponent],
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
    MortgageeModule,
    OptionalPremiumModule,
    AdditionalInterestModule,
    QuoteLineItemsModule,
    PipesModule,
    PropertyDeductibleModule,
    PropertyBuildingModule,
    PropertyImportModule,
    PropertyBuildingCoverageModule,
    PropertyBuildingCoverageEditModule,
    FormsModule,
    PolicyFormsModule,
    SubjectivitiesModule,
    DisclaimersModule,
    GeneralRemarksModule,
    InternalNotesModule,
    WarrantiesModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    CanDeactivateGuard,
    CanDeactivateChildGuard,
    DatePipe,
    FormatDateForDisplay,
    QuoteDataValidationService,
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

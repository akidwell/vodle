import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolicyRoutingModule } from './policy-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { PolicyComponent } from './components/policy/policy.component';
import { PolicyHeaderComponent } from './components/header/policy-header.component';
import { EndorsementCoverageLocationGroupComponent } from './components/endorsement-coverage-location-group/endorsement-coverage-location-group.component';
import { AccountInformationComponent } from './components/account-information/account-information.component';
import { PolicyInformationComponent } from './components/policy-information/policy-information.component';
import { InformationComponent } from './components/information/information.component';
import { CoveragesComponent } from './components/coverages/coverages.component';
import { EndorsementCoverageComponent } from './components/endorsement-coverage/endorsement-coverage.component';
import { HoverClassDirective } from 'src/app/shared/directives/hover-class.directive';
import { EndorsementHeaderComponent } from './components/endorsement-header/endorsement-header.component';
import { NotificationComponent } from 'src/app/core/components/notification/notification-container.component';
import { EndorsementCoverageLocationComponent } from './components/endorsement-coverage-location/endorsement-coverage-location.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { ReinsuranceComponent } from './components/reinsurance/reinsurance.component';
import { SummaryComponent } from './components/summary/summary.component';
import { AdditionalNamedInsuredsComponent } from './components/additional-named-insureds/additional-named-insureds.component';
import { AdditionalNamedInsuredsGroupComponent } from './components/additional-named-insureds-group/additional-named-insureds-group.component';
import { EndorsementLocationGroupComponent } from './components/endorsement-location-group/endorsement-location-group.component';
import { EndorsementLocationComponent } from './components/endorsement-location/endorsement-location.component';
import { EndorsementCoverageDirective } from './components/endorsement-coverage/endorsement-coverage.directive';
import { ReinsuranceLayerComponent } from './components/reinsurance-layer/reinsurance-layer.component';
import { PolicyLayerHeaderComponent } from './components/policy-layer-header/policy-layer-header.component';
import { PolicyLayerGroupComponent } from './components/policy-layer-group/policy-layer-group.component';
import { UnderlyingCoveragesComponent } from './components/underlying-coverages/underlying-coverages.component';
import { UnderlyingCoverageDetailComponent } from './components/underlying-coverage-detail/underlying-coverage-detail.component';
import { UnderlyingCoverageLimitBasisComponent } from './components/underlying-coverage-limit-basis/underlying-coverage-limit-basis.component';
import { InvoiceGroupComponent } from './components/invoice-group/invoice-group.component';
import { InvoiceDetailComponent } from './components/invoice-detail/invoice-detail.component';
import { InvoiceMasterComponent } from './components/invoice-master/invoice-master.component';
import { BusyModule } from 'src/app/core/components/busy/busy.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { UpdatePolicyChild } from './services/update-child/update-child.service';
import { UnderlyingCoverageService } from './services/underlying-coverage/underlying-coverage.service';
import { LimitsPatternHelperService } from './services/limits-pattern-helper/limits-pattern-helper.service';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { EndorsementStoredValues } from './services/endorsement-stored-values/endorsement-stored-values.service';
import { ConfirmationDialogService } from '../../core/services/confirmation-dialog/confirmation-dialog.service';
import { DATE_FORMATS } from 'src/app/core/constants/date-format';

@NgModule({
  declarations: [
    PolicyComponent,
    PolicyHeaderComponent,
    EndorsementCoverageLocationGroupComponent,
    AccountInformationComponent,
    InformationComponent,
    PolicyInformationComponent,
    CoveragesComponent,
    EndorsementCoverageComponent,
    HoverClassDirective,
    EndorsementHeaderComponent,
    NotificationComponent,
    EndorsementCoverageLocationComponent,
    SchedulesComponent,
    ReinsuranceComponent,
    SummaryComponent,
    AdditionalNamedInsuredsComponent,
    AdditionalNamedInsuredsGroupComponent,
    EndorsementLocationGroupComponent,
    EndorsementLocationComponent,
    EndorsementCoverageDirective,
    ReinsuranceLayerComponent,
    PolicyLayerHeaderComponent,
    PolicyLayerGroupComponent,
    UnderlyingCoveragesComponent,
    UnderlyingCoverageDetailComponent,
    UnderlyingCoverageLimitBasisComponent,
    InvoiceGroupComponent,
    InvoiceDetailComponent,
    InvoiceMasterComponent,
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    NgSelectModule,
    BusyModule,
    DirectivesModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    PipesModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    CanDeactivateGuard,
    DatePipe,
    UpdatePolicyChild,
    UnderlyingCoverageService,
    LimitsPatternHelperService,
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
export class PolicyModule { }

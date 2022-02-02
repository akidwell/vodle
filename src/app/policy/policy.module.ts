import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyComponent } from './policy.component';
import { PolicyHeaderComponent } from './header/policy-header.component';
import { EndorsementCoverageLocationGroupComponent } from './coverages/endorsement-coverage-location-group/endorsement-coverage-location-group.component';
import { AccountInformationComponent } from './information/account-information/account-information.component';
import { PolicyInformationComponent } from './information/policy-information/policy-information.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InformationComponent } from './information/information.component';
import { ZipCodePipe } from './information/account-information/zip-code.pipe';
import { CoveragesComponent } from './coverages/coverages.component';
import { EndorsementCoverageComponent } from './coverages/endorsement-coverage-location-group/endorsement-coverage/endorsement-coverage.component';
import { HoverClassDirective } from '../directives/hover-class.directive';
import { EndorsementHeaderComponent } from './coverages/endorsement-header/endorsement-header.component';
import { NgxMaskModule } from 'ngx-mask';
import { NotificationComponent } from '../notification/notification-container.component';
import { EndorsementCoverageLocationComponent } from './coverages/endorsement-coverage-location-group/endorsement-coverage-location/endorsement-coverage-location.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { ReinsuranceComponent } from './reinsurance/reinsurance.component';
import { SummaryComponent } from './summary/summary.component';
import { CanDeactivateGuard } from './can-deactivate-guard';
import { AdditionalNamedInsuredsComponent } from './schedules/additional-named-insureds-group/additional-named-insureds/additional-named-insureds.component';
import { AdditionalNamedInsuredsGroupComponent } from './schedules/additional-named-insureds-group/additional-named-insureds-group.component';
import { EndorsementLocationComponent } from './schedules/endorsement-location-group/endorsement-location/endorsement-location.component';
import { EndorsementLocationGroupComponent } from './schedules/endorsement-location-group/endorsement-location-group.component';
import { UpdatePolicyChild } from './services/update-child.service';
import { EndorsementCoverageDirective } from './coverages/endorsement-coverage-location-group/endorsement-coverage/endorsement-coverage.directive';
import { ReinsuranceLayerComponent } from './reinsurance/policy-layer-group/reinsurance-layer/reinsurance-layer.component';
import { PolicyLayerHeaderComponent } from './reinsurance/policy-layer-header/policy-layer-header.component';
import { PolicyLayerGroupComponent } from './reinsurance/policy-layer-group/policy-layer-group.component';
import { UnderlyingCoveragesComponent } from './schedules/underlying-coverages/underlying-coverages.component';
import { UnderlyingCoverageDetailComponent } from './schedules/underlying-coverages/underlying-coverage-detail/underlying-coverage-detail.component';
import { UnderlyingCoverageLimitBasisComponent } from './schedules/underlying-coverages/underlying-coverage-limit-basis/underlying-coverage-limit-basis.component';
import { UnderlyingCoverageService } from './schedules/services/underlying-coverage.service';
import { LimitsPatternHelperService } from './services/limits-pattern-helper.service';
import { InvoiceDetailComponent } from './summary/invoice-group/invoice-detail/invoice-detail.component';
import { InvoiceGroupComponent } from './summary/invoice-group/invoice-group.component';
import { InvoiceMasterComponent } from './summary/invoice-group/invoice-master/invoice-master.component';
import { BusyModule } from '../busy/busy.module';
import { DirectivesModule } from '../directives/directives.module';
import { MatDatepickerModule } from '@angular/material/datepicker'

@NgModule({
  declarations: [
    PolicyComponent,
    PolicyHeaderComponent,
    EndorsementCoverageLocationGroupComponent,
    AccountInformationComponent,
    InformationComponent,
    PolicyInformationComponent,
    CoveragesComponent,
    ZipCodePipe,
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
    InvoiceMasterComponent
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
    NgxMaskModule.forRoot()
  ],
  providers: [
    CanDeactivateGuard,
    DatePipe,
    UpdatePolicyChild,
    UnderlyingCoverageService,
    LimitsPatternHelperService
  ]
})
export class PolicyModule { }

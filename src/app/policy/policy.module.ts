import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyComponent } from './policy.component';
import { PolicyHeaderComponent } from './header/policy-header.component';
import { EndorsementLocationGroupComponent } from './endorsement-location-group/endorsement-location-group.component';
import { AccountInformationComponent } from './information/account-information/account-information.component';
import { PolicyInformationComponent } from './information/policy-information/policy-information.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InformationComponent } from './information/information.component';
import { ZipCodePipe } from './information/account-information/zip-code.pipe';
import { CoveragesComponent } from './coverages/coverages.component';
import { EndorsementCoverageComponent } from './endorsement-coverage/endorsement-coverage.component';
import { HoverClassDirective } from '../directives/hover-class.directive';
import { EndorsementHeaderComponent } from './coverages/endorsement-header/endorsement-header.component';
import { NgxMaskModule } from 'ngx-mask';
import { NotificationComponent } from '../notification/notification-container.component';
import { EndorsementCoverageLocationComponent } from './endorsement-coverage-location/endorsement-coverage-location.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { ReinsuranceComponent } from './reinsurance/reinsurance.component';
import { SummaryComponent } from './summary/summary.component';
import { CanDeactivateGuard } from './can-deactivate-guard';
import { NotifyOnSave } from './services/notify-on-save.service';
import { AdditionalNamedInsuredsComponent } from './schedules/additional-named-insureds/additional-named-insureds.component';
import { AdditionalNamedInsuredsGroupComponent } from './schedules/additional-named-insureds-group/additional-named-insureds-group.component';
import { EndorsementLocationComponent } from './schedules/endorsement-location-group/endorsement-location/endorsement-location.component';
import { EndorsementLocationGroupComponent2 } from './schedules/endorsement-location-group/endorsement-location-group.component';

@NgModule({
  declarations: [
    PolicyComponent,
    PolicyHeaderComponent,
    EndorsementLocationGroupComponent,
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
    EndorsementLocationGroupComponent2,
    EndorsementLocationComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    NgSelectModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    CanDeactivateGuard,
    DatePipe,
    NotifyOnSave
  ]
})
export class PolicyModule { }

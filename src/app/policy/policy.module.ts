import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    EndorsementCoverageLocationComponent
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    NgSelectModule,
    NgxMaskModule.forRoot()
  ]
})
export class PolicyModule { }

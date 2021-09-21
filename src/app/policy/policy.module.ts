import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyComponent } from './policy.component';

import { PolicyHeaderComponent } from './header/policy-header.component';
import { EndorsementCoveragesComponent } from './endorsement-coverages/endorsement-coverages.component';
import { AccountInformationComponent } from './information/account-information/account-information.component';
import { PolicyInformationComponent } from './information/policy-information/policy-information.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InformationComponent } from './information/information.component';
import { ZipCodePipe } from './information/account-information/zip-code.pipe';
import { CoveragesComponent } from './coverages/coverages.component';

@NgModule({
  declarations: [
    PolicyComponent,
    PolicyHeaderComponent,
    EndorsementCoveragesComponent,
    AccountInformationComponent,
    InformationComponent,
    PolicyInformationComponent,
    CoveragesComponent,
    ZipCodePipe
  ],
  imports: [
    CommonModule,
    PolicyRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    NgSelectModule
  ]
})
export class PolicyModule { }

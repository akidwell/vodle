import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InsuredRoutingModule } from './insured-routing.module';
import { AdditionalNamedInsuredModule } from '../../shared/components/additional-named-insured/additional-named-insured.module';
import { InsuredComponent } from './components/insured-base/insured.component';
import { InsuredAccountComponent } from 'src/app/features/insured/components/insured-account/insured-account.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { InsuredContactGroupComponent } from './components/insured-contact-group/insured-contact-group.component';
import { InsuredContactComponent } from './components/insured-contact/insured-contact.component';
import { InsuredInformationComponent } from './components/insured-information/insured-information.component';
import { InsuredSubmissionActivityComponent } from './components/insured-submission-activity/insured-submission-activity.component';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { BusyModule } from 'src/app/core/components/busy/busy.module';
import { InsuredHeaderComponent } from './components/insured-header/insured-header.component';
import { InsuredAccountAddressComponent } from './components/insured-account-address/insured-account-address.component';
import { InsuredAccountCenterComponent } from './components/insured-account-center/insured-account-center.component';
import { InsuredAccountRightComponent } from './components/insured-account-right/insured-account-right.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { SubmissionActivityModule } from 'src/app/shared/components/submission-activity/submission-activity.module';
import { InsuredDuplicatesComponent } from './components/insured-duplicates/insured-duplicates.component';


@NgModule({
  declarations: [
    InsuredComponent,
    InsuredAccountComponent,
    InsuredContactComponent,
    InsuredContactGroupComponent,
    InsuredInformationComponent,
    InsuredHeaderComponent,
    InsuredAccountAddressComponent,
    InsuredAccountCenterComponent,
    InsuredAccountRightComponent,
    InsuredSubmissionActivityComponent,
    InsuredDuplicatesComponent
  ],
  imports: [
    CommonModule,
    InsuredRoutingModule,
    AdditionalNamedInsuredModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    NgSelectModule,
    DirectivesModule,
    BusyModule,
    PipesModule,
    SubmissionActivityModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    CanDeactivateGuard,
    DatePipe
  ]
})
export class InsuredModule { }
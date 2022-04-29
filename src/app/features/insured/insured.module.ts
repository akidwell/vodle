import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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


@NgModule({
  declarations: [
    InsuredComponent,
    InsuredAccountComponent,
    InsuredContactComponent,
    InsuredContactGroupComponent,
    InsuredInformationComponent,
    InsuredSubmissionActivityComponent],
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
    NgxMaskModule.forRoot()
  ],
  providers: [
    CanDeactivateGuard
  ]
})
export class InsuredModule { }
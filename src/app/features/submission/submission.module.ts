import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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


@NgModule({
  declarations: [
    SubmissionComponent
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
    NgxMaskModule.forRoot()
  ],
  providers: [
    CanDeactivateGuard
  ]
})
export class SubmissionModule { }

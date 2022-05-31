import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSubmissionActivityComponent } from './submission-activity/submission-activity.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../../directives/directives.module';
import { SubmissionStatusComponent } from './submission-status/submission-status.component';
import { SubmissionStatusService } from './submission-status/submission-status.service';
import { BusyModule } from 'src/app/core/components/busy/busy.module';

@NgModule({
  declarations: [
    SharedSubmissionActivityComponent,
    SubmissionStatusComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    DirectivesModule,
    BusyModule
  ],
  providers: [
    SubmissionStatusService
  ],
  exports: [
    SharedSubmissionActivityComponent,
    SubmissionStatusComponent
  ]
})
export class SubmissionActivityModule { }

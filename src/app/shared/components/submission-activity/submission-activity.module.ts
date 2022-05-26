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
import { RouterModule } from '@angular/router';

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
    FormsModule,
    DirectivesModule,
    RouterModule
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

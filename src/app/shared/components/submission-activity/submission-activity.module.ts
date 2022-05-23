import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedSubmissionActivityComponent } from './submission-activity/submission-activity.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../../directives/directives.module';
import { SubmissionMarkModule } from '../submission-mark/submission-mark.module';




@NgModule({
  declarations: [
    SharedSubmissionActivityComponent ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    DirectivesModule,
    SubmissionMarkModule
  ],
  exports: [SharedSubmissionActivityComponent]
})
export class SubmissionActivityModule { }

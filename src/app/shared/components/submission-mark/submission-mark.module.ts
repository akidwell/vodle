import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SubmissionMarkService } from './submission-mark.service';
import { SubmissionMarkComponent } from './submission-mark/submission-mark.component';

@NgModule({
  declarations: [
    SubmissionMarkComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule
  ],
  exports: [SubmissionMarkComponent],
  providers: [
    SubmissionMarkService
  ]
})
export class SubmissionMarkModule { }

import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom } from 'rxjs';
import { SubmissionEventEnum } from 'src/app/core/enums/submission-event.enum';
import { SubmissionSearchResponses } from 'src/app/features/home/models/search-results';
import { SubmissionService } from 'src/app/features/submission/services/submission-service/submission-service';
import { SubmissionMarkService } from '../../submission-mark/submission-mark.service';

@Component({
  selector: 'shared-rsps-submission-activity',
  templateUrl: './submission-activity.component.html',
  styleUrls: ['./submission-activity.component.css']
})
export class SharedSubmissionActivityComponent implements OnInit {

  constructor(private submissionMarkService: SubmissionMarkService, private submissionService: SubmissionService) { }

  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  collapsed = false;
  canEdit = false;


  @Input('submissionResults') submissionResults!: SubmissionSearchResponses[];

  ngOnInit(): void {
  }

  async markDeadDecline(submissionNumber: number) {
    const results$ = this.submissionService.getSubmission(submissionNumber);
    const submission = await lastValueFrom(results$);
    return this.submissionMarkService.open(submission);
  }
}

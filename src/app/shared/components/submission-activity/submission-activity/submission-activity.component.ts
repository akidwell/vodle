import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SubmissionSearchResponses } from 'src/app/features/home/models/search-results';
import { SubmissionService } from 'src/app/features/submission/services/submission-service/submission-service';
import { SubmissionStatusService } from '../submission-status/submission-status.service';

@Component({
  selector: 'shared-rsps-submission-activity',
  templateUrl: './submission-activity.component.html',
  styleUrls: ['./submission-activity.component.css']
})
export class SharedSubmissionActivityComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  collapsed = false;
  canEdit = false;
  canEditSubmission = false;
  authSub: Subscription;

  constructor(private userAuth: UserAuth, private submissionStatusService: SubmissionStatusService, private submissionService: SubmissionService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }

  @Input('submissionResults') submissionResults!: SubmissionSearchResponses[];

  ngOnInit(): void {
  }

  async markDeadDecline(submissionNumber: number) {
    const results$ = this.submissionService.getSubmission(submissionNumber);
    const submission = await lastValueFrom(results$);
    return this.submissionStatusService.open(submission);
  }
}

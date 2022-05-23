import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SubmissionSearchResponses } from 'src/app/features/home/models/search-results';

@Component({
  selector: 'shared-rsps-submission-activity',
  templateUrl: './submission-activity.component.html',
  styleUrls: ['./submission-activity.component.css']
})
export class SharedSubmissionActivityComponent implements OnInit {
  canEditSubmission = false;
  authSub: Subscription;

  constructor( private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    ); }

  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  collapsed = false;
  canEdit = false;


  @Input('submissionResults') submissionResults!: SubmissionSearchResponses[];

  ngOnInit(): void {
  }

}

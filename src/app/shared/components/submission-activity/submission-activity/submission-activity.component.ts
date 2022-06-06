import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SubmissionSearchResponses } from 'src/app/features/home/models/search-results';
import { newSubmissionStatus } from 'src/app/features/submission/models/submission-status';
import { SubmissionStatusService } from '../submission-status/submission-status.service';
import { PolicySearchService } from 'src/app/features/home/services/policy-search/policy-search.service';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { SubmissionService } from 'src/app/features/submission/services/submission-service/submission-service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';

@Component({
  selector: 'shared-rsps-submission-activity',
  templateUrl: './submission-activity.component.html',
  styleUrls: ['./submission-activity.component.css']
})
export class SharedSubmissionActivityComponent implements OnInit {

  constructor( private userAuth: UserAuth, private router: Router, private navigationService: NavigationService, private policySearchService: PolicySearchService,
    private submissionStatusService: SubmissionStatusService,private submissionService: SubmissionService, private messageDialogService: MessageDialogService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    ); }

  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  collapsed = false;
  canEdit = false;
  canEditSubmission = false;
  authSub: Subscription;
  sub!: Subscription;
  searchTerm = '';

  @Input('submissionResults') submissionResults!: SubmissionSearchResponses[];

  ngOnInit(): void {

  }

  checkIfHomeRoute(): boolean {
    if(this.router.url == '/home'){
      return false;
    }else {
      return true;
    }
  }

  routeToSubmission(submissionNumber: number) {
    this.navigationService.resetPolicy();
    this.router.navigate(['/submission/' + submissionNumber.toString() + '/information']);
  }

  search(policyNumber: string): void {
    console.log(this.submissionResults);
    if(this.router.url != '/home'){
      this.router.navigate(['/home']);
    }
    this.sub = this.policySearchService.getPolicySearch(policyNumber).subscribe();
  }

  async markDeadDecline(submission: SubmissionSearchResponses) {
    const submissionStatus = newSubmissionStatus();
    submissionStatus.submissionNumber = submission.submissionNumber;
    submissionStatus.isNew = submission.renewalFlag == 'N';
    const status = await this.submissionStatusService.openDeadDecline(submissionStatus);
    if (status != null) {
      submission.submissionStatus = status.toString();
    }
  }

  async markReactivate(submission: SubmissionSearchResponses) {
    const submissionStatus = newSubmissionStatus();
    submissionStatus.submissionNumber = submission.submissionNumber;
    const status = await this.submissionStatusService.openReactivate(submissionStatus);
    if (status != null) {
      submission.submissionStatus = status.toString();
    }
  }

  async renew(submission: SubmissionSearchResponses) {
    // Commented out for now since this will need to be different

    const status$ = this.submissionService.renew(submission.submissionNumber);
    await lastValueFrom(status$).then(result => {
      this.router.navigate(['/submission'],{ state: { submission: result } });
    },
    error => {
      const errorMessage = error.error?.Message ?? error.message;
      this.messageDialogService.open('Error', 'Error Message: ' + errorMessage);
    });
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SubmissionService } from 'src/app/features/submission/services/submission-service/submission-service';
import { SubmissionStatusService } from '../submission-status/submission-status.service';
import { SubmissionSearchResponses } from 'src/app/features/home/models/search-results';
import { PolicySearchService } from 'src/app/features/home/services/policy-search/policy-search.service';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';

@Component({
  selector: 'shared-rsps-submission-activity',
  templateUrl: './submission-activity.component.html',
  styleUrls: ['./submission-activity.component.css']
})
export class SharedSubmissionActivityComponent implements OnInit {

  constructor( private userAuth: UserAuth, private router: Router, private navigationService: NavigationService, private policySearchService: PolicySearchService, 
    private submissionService: SubmissionService, private submissionStatusService: SubmissionStatusService,) {
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

  async markDeadDecline(submissionNumber: number) {
    const results$ = this.submissionService.getSubmission(submissionNumber);
    const submission = await lastValueFrom(results$);
    return this.submissionStatusService.open(submission);
  }
}

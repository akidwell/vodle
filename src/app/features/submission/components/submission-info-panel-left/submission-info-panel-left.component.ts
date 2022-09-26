import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { Code } from 'src/app/core/models/code';
import { SubmissionClass } from '../../classes/submission-class';

@Component({
  selector: 'rsps-submission-info-panel-left',
  templateUrl: './submission-info-panel-left.component.html',
  styleUrls: ['./submission-info-panel-left.component.css']
})
export class SubmissionInfoPanelLeftComponent implements OnInit {
  authSub: Subscription;
  canEditSubmission = false;
  lockSubmissionFields = false;
  isRenewable = true;
  newRenewalFlags: Code[] = [];
  @Input() public submission!: SubmissionClass;

  constructor(private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }
  ngOnInit(): void {
    this.newRenewalFlags = this.submission.newRenewalFlag === 2 ? [{'key': 2, 'description': 'Renewal', code: ''}] : [{'key': 1, 'description': 'New', code: ''}, {'key': 3, 'description': 'Count as Renewal', code: ''}];
    this.isRenewable = this.submission.renewablePolicy == 1 ? true : false;
  }
  isFieldReadOnly(checkSubmissionLockStatus: boolean): boolean {
    if(!checkSubmissionLockStatus) {
      return !this.canEditSubmission;
    } else {
      if (this.lockSubmissionFields) {
        return true;
      } else {
        return !this.canEditSubmission;
      }
    }
  }
}

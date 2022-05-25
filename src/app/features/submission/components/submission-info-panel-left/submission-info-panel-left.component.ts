import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { Submission } from '../../models/submission';

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
  newRenewalFlags = [{'value': 1, 'description': 'New'}, {'value': 2, 'description': 'Renewal'}, {'value': 3, 'description': 'Count as Renewal'}];
  @Input() public submission!: Submission;

  constructor(private userAuth: UserAuth, private dropdowns: DropDownsService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }
  ngOnInit(): void {

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
  changeRenewable() {
    this.submission.renewablePolicy = this.isRenewable ? 1 : 0;
  }
}

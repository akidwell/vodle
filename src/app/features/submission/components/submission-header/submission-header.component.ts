import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { PolicyTermEnum } from 'src/app/core/enums/policy-term-enum';
import { SubmissionClass } from '../../classes/SubmissionClass';

@Component({
  selector: 'rsps-submission-header',
  templateUrl: './submission-header.component.html',
  styleUrls: ['./submission-header.component.css']
})
export class SubmissionHeaderComponent {
  authSub: Subscription;
  canEditSubmission = false;
  isReadOnly = true;
  @Input() public submission!: SubmissionClass;
  policyTermOptions = [{'value': PolicyTermEnum.three_months, 'description': '3 months'},{'value': PolicyTermEnum.six_months, 'description': '6 months'}, {'value': PolicyTermEnum.annual, 'description': 'Annual'}, {'value': PolicyTermEnum.eighteen_months, 'description': '18 months'}, {'value': PolicyTermEnum.custom, 'description': 'Custom'}];
 
  constructor(private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }
}

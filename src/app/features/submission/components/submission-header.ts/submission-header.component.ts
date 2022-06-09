import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { PolicyTermEnum } from 'src/app/core/enums/policy-term-enum';
import { SubmissionClass } from '../../classes/SubmissionClass';

@Component({
  selector: 'rsps-submission-header',
  templateUrl: './submission-header.component.html',
  styleUrls: ['./submission-header.component.css']
})
export class SubmissionHeaderComponent implements OnInit {
  authSub: Subscription;
  canEditSubmission = false;
  @Input() public submission!: SubmissionClass;
  policyTermOptions = [{'value': PolicyTermEnum.three_months, 'description': '3 months'},{'value': PolicyTermEnum.six_months, 'description': '6 months'}, {'value': PolicyTermEnum.annual, 'description': 'Annual'}, {'value': PolicyTermEnum.eighteen_months, 'description': '18 months'}, {'value': PolicyTermEnum.custom, 'description': 'Custom'}];
  constructor(private route: ActivatedRoute, private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.submission = data['submissionData'].submission;
    });
  }

}

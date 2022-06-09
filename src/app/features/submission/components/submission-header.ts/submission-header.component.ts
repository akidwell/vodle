import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyTermEnum } from 'src/app/core/enums/policy-term-enum';
import { SubmissionClass } from '../../classes/SubmissionClass';

@Component({
  selector: 'rsps-submission-header',
  templateUrl: './submission-header.component.html',
  styleUrls: ['./submission-header.component.css']
})
export class SubmissionHeaderComponent implements OnInit {
  submission!: SubmissionClass;
  policyTermOptions = [{'value': PolicyTermEnum.six_months, 'description': '6 months'}, {'value': PolicyTermEnum.annual, 'description': 'Annual'}, {'value': PolicyTermEnum.eighteen_months, 'description': '18 months'}, {'value': PolicyTermEnum.two_years, 'description': '2 years'}, {'value': PolicyTermEnum.custom, 'description': 'Custom'}];
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.submission = data['submissionData'].submission;
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Submission } from '../../models/submission';

@Component({
  selector: 'rsps-submission-header',
  templateUrl: './submission-header.component.html',
  styleUrls: ['./submission-header.component.css']
})
export class SubmissionHeaderComponent implements OnInit {
  submission!: Submission;
  policyTermOptions = [{'value': 6, 'description': '6 months'}, {'value': 12, 'description': '1 year'}, {'value': 18, 'description': '18 months'}, {'value': 0, 'description': 'Custom'}];
  policyTerm: number | null = 0;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.submission = data['submissionData'].submission;
      console.log(this.submission.polEffDate);
    });
  }
  policyTermChange() {
    if (this.policyTerm) {
      this.submission.polExpDate = moment(this.submission.polEffDate).add(this.policyTerm, 'M').toDate();
    }
    console.log(this.submission.polExpDate);
  }
  changeEffDate(): void {
    if (this.policyTerm) {
      this.submission.polExpDate = moment(this.submission.polEffDate).add(this.policyTerm, 'M').toDate();
    }
    console.log(this.submission.polExpDate);
  }
  changeExpDate(): void {
    this.policyTerm = 0;
  }
}

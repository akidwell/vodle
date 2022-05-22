import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Submission } from '../../models/submission';

@Component({
  selector: 'rsps-submission-header',
  templateUrl: './submission-header.component.html',
  styleUrls: ['./submission-header.component.css']
})
export class SubmissionHeaderComponent implements OnInit {
  submission!: Submission;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.submission = data['submissionData'].submission;
      console.log(this.submission.polEffDate);
    });
  }
  changeEffDate(): void {
    console.log(this.submission.polEffDate);
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { SubmissionSearchResponses } from 'src/app/features/home/models/search-results';

@Component({
  selector: 'shared-rsps-submission-activity',
  templateUrl: './submission-activity.component.html',
  styleUrls: ['./submission-activity.component.css']
})
export class SharedSubmissionActivityComponent implements OnInit {

  constructor() { }

  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  collapsed = false;
  canEdit = false;


  @Input('submissionResults') submissionResults!: SubmissionSearchResponses[];

  ngOnInit(): void {
  }

}

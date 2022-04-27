import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { SearchResults } from '../../../models/search-results';

@Component({
  selector: 'rsps-submission-search-results',
  templateUrl: './submission-search-results.component.html',
  styleUrls: ['./submission-search-results.component.css']
})
export class SubmissionSearchResultsComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  collapsed: boolean = false;
  canEdit: boolean = false;

  @Input('searchResults') searchResults: SearchResults = {
    policySearchResponses: [],
    submissionSearchResponses: [],
    insuredSearchResponses: []
  };


  constructor() { }

  ngOnInit(): void {
  }

}

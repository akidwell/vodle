import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { SearchResults } from '../../../models/search-results';

@Component({
  selector: 'rsps-insured-search-results',
  templateUrl: './insured-search-results.component.html',
  styleUrls: ['./insured-search-results.component.css']
})
export class InsuredSearchResultsComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  collapsed: boolean = false;
  canEdit: boolean = false;

  @Input('searchResults') searchResults: SearchResults = {
    policySearchResponses: [],
    submissionSearchResponses: [],
    insuredSearchResponses: []
  };
  
  constructor( private router: Router) { }

  ngOnInit(): void {
  }

  routeToInsured(insuredCode: number) {

      this.router.navigate(['/insured/' + insuredCode]);
  }

}

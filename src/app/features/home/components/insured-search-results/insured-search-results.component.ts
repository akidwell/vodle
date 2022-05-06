import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { SearchResults } from '../../models/search-results';
import { PolicySearchService } from '../../services/policy-search/policy-search.service';


@Component({
  selector: 'rsps-insured-search-results',
  templateUrl: './insured-search-results.component.html',
  styleUrls: ['./insured-search-results.component.css']
})
export class InsuredSearchResultsComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  searchFilter: string = "";
  collapsed: boolean = false;


  @Input('searchResults') searchResults: SearchResults = {
    policySearchResponses: [],
    submissionSearchResponses: [],
    insuredSearchResponses: [],
    searchType: ""
  };
  
  constructor(private router: Router, private navigationService: NavigationService) { }

  ngOnInit(): void {
 
      }

  routeToInsured(insuredCode: number) {
    this.navigationService.resetPolicy();
    this.router.navigate(['/insured/' + insuredCode.toString() + '/information']);
  }

}

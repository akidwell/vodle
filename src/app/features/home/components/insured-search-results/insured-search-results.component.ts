import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { SearchResults } from '../../models/search-results';

@Component({
  selector: 'rsps-insured-search-results',
  templateUrl: './insured-search-results.component.html',
  styleUrls: ['./insured-search-results.component.css']
})
export class InsuredSearchResultsComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  searchFilter = '';
  collapsed = false;
  canEditInsured = false;
  authSub!: Subscription;

  @Input('searchResults') searchResults: SearchResults = {
    policySearchResponses: [],
    submissionSearchResponses: [],
    insuredSearchResponses: [],
    searchType: ''
  };

  constructor(private router: Router, private navigationService: NavigationService, private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
  }

  ngOnInit(): void {

  }

  routeToInsured(insuredCode: number) {
    this.navigationService.resetPolicy();
    this.router.navigate(['/insured/' + insuredCode.toString() + '/information']);
  }

  routeToNewInsured() {
    this.navigationService.resetPolicy();
    this.router.navigate(['/insured/information']);
  }
}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { APIVersionService } from 'src/app/core/services/API-version-service/api-version.service';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { SearchResults, SubmissionSearchResponses } from '../../models/search-results';
import { PolicySearchService } from '../../services/policy-search/policy-search.service';
import { DirectPolicyComponent } from '../direct-policy/direct-policy.component';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['../../../../app.component.css','./home.component.css']
})
export class HomeComponent implements OnInit {
  directPolicySubscription!: Subscription;

  @ViewChild('modal') private directPolicyComponent!: DirectPolicyComponent;

  @Input('searchResults') searchResults: SearchResults = {
    policySearchResponses: [],
    submissionSearchResponses: [],
    insuredSearchResponses: [],
    searchType: ''
  };
  @Input('submissionResults') submissionResults!: SubmissionSearchResponses[];

  searchSub!: Subscription;
  loadingSub!: Subscription;
  loading = false;
  version = '';

  constructor(private navigationService: NavigationService, private policySearchService: PolicySearchService, private apiService: APIVersionService) { }

  ngOnInit(): void {
    this.directPolicySubscription = this.navigationService.createDirectPolicy$.subscribe(() => {
      this.directPolicyComponent.open();
    });
    this.loadingSub = this.policySearchService.loading$.subscribe({
      next: results => {
        this.loading = results;
      }
    });
    this.searchSub = this.policySearchService.searchResults.subscribe({
      next: results => {

        this.searchResults.policySearchResponses = results.policySearchResponses;
        this.searchResults.submissionSearchResponses = results.submissionSearchResponses;
        this.searchResults.insuredSearchResponses = results.insuredSearchResponses;
        this.searchResults.searchType = results.searchType;
        this.submissionResults = results.submissionSearchResponses;
        this.version = this.apiService.getApiVersion;
      }
    });
  }

  ngOnDestroy(): void {
    this.directPolicySubscription.unsubscribe();
  }

}

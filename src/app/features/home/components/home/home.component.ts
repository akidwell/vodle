import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import {
  InsuredSearchResponses,
  SearchResults,
  SubmissionSearchResponses,
} from '../../models/search-results';
import { PolicySearchService } from '../../services/policy-search/policy-search.service';
import { DirectPolicyComponent } from '../direct-policy/direct-policy.component';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['../../../../app.component.css', './home.component.css'],
})
export class HomeComponent implements OnInit {
  directPolicySubscription!: Subscription;
  searchSub!: Subscription;
  loadingSub!: Subscription;
  loading = false;

  @ViewChild('modal') private directPolicyComponent!: DirectPolicyComponent;
  @Input('submissionResults') submissionResults!: SubmissionSearchResponses[];
  @Input('pacerSearchResults') pacerSearchResults: InsuredSearchResponses[] = [];
  @Input('insuredResults') insuredResults: InsuredSearchResponses[] = [];
  @Input('searchResults') searchResults: SearchResults = {
    policySearchResponses: [],
    submissionSearchResponses: [],
    insuredSearchResponses: [],
    searchType: null,
  };

  constructor(
    private navigationService: NavigationService,
    private policySearchService: PolicySearchService,
    public headerPaddingService: HeaderPaddingService
  ) {}

  ngOnInit(): void {
    this.directPolicySubscription = this.navigationService.createDirectPolicy$.subscribe(() => {
      this.directPolicyComponent.open();
    });
    this.loadingSub = this.policySearchService.loading$.subscribe({
      next: (results) => {
        this.loading = results;
      },
    });
    this.searchSub = this.policySearchService.searchResults.subscribe({
      next: (results) => {
        this.searchResults.policySearchResponses = results.policySearchResponses;
        this.searchResults.submissionSearchResponses = results.submissionSearchResponses;
        this.searchResults.insuredSearchResponses = results.insuredSearchResponses;
        this.searchResults.searchType = results.searchType;
        this.submissionResults = results.submissionSearchResponses;
        this.insuredResults = [];
        this.pacerSearchResults = [];
        this.searchResults.insuredSearchResponses.forEach((element) => {
          if (element.isPacerResult) {
            this.pacerSearchResults.push(element);
          } else if (!element.isPacerResult) {
            this.insuredResults.push(element);
          }
        });
      },
    });
  }

  checkToDisplayInsuredPanel(): boolean {
    return (this.searchResults.insuredSearchResponses.length > 0)
    || (this.searchResults.searchType != null && this.searchResults.submissionSearchResponses.length == 0 && this.searchResults.policySearchResponses.length == 0 && this.searchResults.insuredSearchResponses.length == 0);
  }

  ngOnDestroy(): void {
    this.directPolicySubscription.unsubscribe();
  }
}

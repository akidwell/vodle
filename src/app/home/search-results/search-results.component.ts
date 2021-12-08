import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomReuseStrategy } from 'src/app/app-reuse-strategy';
import { PolicySearchResults } from './policy-search-results';
import { PolicySearchService } from './policy-search.service';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { PolicyHistoryService } from 'src/app/navigation/policy-history.service';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';

@Component({
  selector: 'rsps-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  searchFilter: string = "";
  searchResults!: PolicySearchResults[];
  searchSub!: Subscription;
  loadingSub!: Subscription;
  loading: boolean = false;
  collapsed: boolean = false;
  insuredName: string = "";
  status: string = "";

  constructor(private router: Router, private route: ActivatedRoute, private policySearchService: PolicySearchService, private routeReuseStrategy: RouteReuseStrategy, private policyHistoryService: PolicyHistoryService, private dropDownService: DropDownsService) {
  }

  ngOnInit(): void {
    this.loadingSub = this.policySearchService.loading$.subscribe({
      next: results => {
        this.loading = results;
      },
      // error: err => this.errorMessage = err
    });

    this.searchSub = this.policySearchService.searchResults.subscribe({
      next: results => {
        // Flag for every new policy number
        let policyNumber: string = "";
        for (let x of results) {
          if (x.policyNumber != policyNumber) {
            x.firstPolicyRow = true;
            policyNumber = x.policyNumber;
          }
        }

        this.searchResults = results;

        if (results.length > 0) {
          this.insuredName = results[0].insuredName;
          let date = new Date();
          let date2 = new Date();
          if (results[0].policyExtendedDate != null) {
            date2 = new Date(results[0].policyExtendedDate);
          }
          else {
            date2 = new Date(results[0].policyExpirationDate);
          }
          if (date <= date2) {
            this.status = "InForce";
          }
          else {
            this.status = "Expired";
          }
        }
      },
      // error: err => this.errorMessage = err
    });
  }

  ngOnDestroy(): void {
    this.loadingSub?.unsubscribe();
    this.searchSub?.unsubscribe();
  }

  openPolicy(policy: PolicySearchResults): void {
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('information');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('coverages');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('schedules');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('reinsurance');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('summary');
    this.dropDownService.clearPolicyDropDowns();
    this.policyHistoryService.updatePolicyHistory(policy.policyId,policy.policyNumber,policy.endorsementNumber);
    this.router.navigate(['/policy/' + policy.policyId.toString() + '/' + policy.endorsementNumber.toString()]);
  }

}

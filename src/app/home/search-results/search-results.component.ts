import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouteReuseStrategy } from '@angular/router';
import { Subscription } from 'rxjs';
import { CustomReuseStrategy } from 'src/app/app-reuse-strategy';
import { PolicySearchResults } from './policy-search-results';
import { PolicySearchService } from './policy-search.service';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

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

  constructor(private router: Router, private route: ActivatedRoute, private policySearchService: PolicySearchService, private routeReuseStrategy: RouteReuseStrategy) {
  }

  ngOnInit(): void {
    this.loadingSub = this.policySearchService.loading$.subscribe({
      next: results => {
        this.loading = results;
      },
      // error: err => this.errorMessage = err
    });

    this.searchSub = this.policySearchService.onResults().subscribe({
      next: results => {

        for (let x of results) {
          if (x.firstPolicyRow) {
            results.push()
          }
        }

        this.searchResults = results;

        if (results.length > 0) {
          this.insuredName = results[0].insuredName;
          let date = new Date()
          if (date <= results[0].policyExpirationDate) {
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
    this.router.navigate(['/policy/' + policy.policyId.toString() + '/' + policy.endorsementNumber.toString()]);
  }

}

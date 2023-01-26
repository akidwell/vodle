import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { NgbdSortableHeaderDirective, SortEvent } from 'src/app/shared/directives/sortable-header';
import { InsuredSearchResponses, SearchResults } from '../../models/search-results';
import { InsuredSearchResultsService } from './insured-search-results-service';


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
  insureds$!: Observable<InsuredSearchResponses[]>;
  total$!: Observable<number>;

  @Input('searchResults') searchResults: SearchResults = {
    policySearchResponses: [],
    submissionSearchResponses: [],
    insuredSearchResponses: [],
    searchType: null
  };

  @Input('insuredResults') insuredResults: InsuredSearchResponses[] = [];

  constructor(private router: Router, private navigationService: NavigationService, private userAuth: UserAuth, public insuredSearchResultsService: InsuredSearchResultsService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
    this.insureds$ = this.insuredSearchResultsService.filterdInsureds$;
    this.total$ = this.insuredSearchResultsService.total$;
  }

  @ViewChildren(NgbdSortableHeaderDirective) headers:
  | QueryList<NgbdSortableHeaderDirective>
  | undefined;

  ngOnInit(): void {
    this.insuredSearchResultsService.insureds = this.insuredResults;
  }

  routeToInsured(insuredCode: number) {
    this.navigationService.clearReuse();
    this.router.navigate(['/insured/' + insuredCode.toString() + '/information']);
  }

  routeToNewInsured() {
    this.navigationService.clearReuse();
    this.router.navigate(['/insured/information']);
  }

  onSort({ sortColumn, sortDirection }: SortEvent) {
    // resetting other headers
    this.headers?.forEach((header) => {
      if (header.sortable !== sortColumn) {
        header.direction = '';
      }
    });
    this.insuredSearchResultsService.sortColumn = sortColumn;
    this.insuredSearchResultsService.sortDirection = sortDirection;
  }
}

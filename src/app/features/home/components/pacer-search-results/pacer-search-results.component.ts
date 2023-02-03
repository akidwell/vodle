import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { NgbdSortableHeaderDirective, SortEvent } from 'src/app/shared/directives/sortable-header';
import { InsuredSearchResponses } from '../../models/search-results';
import { PacerSearchResultsService } from './pacer-search-results-service';


@Component({
  selector: 'rsps-pacer-search-results',
  templateUrl: './pacer-search-results.component.html',
  styleUrls: ['./pacer-search-results.component.css']
})
export class PacerSearchResultsComponent implements OnInit {
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  searchFilter = '';
  collapsed = false;
  canEditInsured = false;
  authSub!: Subscription;
  navigationExtras!: NavigationExtras;
  insureds$!: Observable<InsuredSearchResponses[]>;
  total$!: Observable<number>;

  @Input('pacerSearchResults') pacerSearchResults: InsuredSearchResponses[] = [];

  @ViewChildren(NgbdSortableHeaderDirective) headers:
  | QueryList<NgbdSortableHeaderDirective>
  | undefined;

  constructor(private router: Router, private navigationService: NavigationService, private userAuth: UserAuth, public pacerSearchResultsService: PacerSearchResultsService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
    this.insureds$ = this.pacerSearchResultsService.filterdInsureds$;
    this.total$ = this.pacerSearchResultsService.total$;
  }

  ngOnInit(): void {
    this.pacerSearchResultsService.insureds = this.pacerSearchResults;

  }

  routeToNewInsuredFromPacer(insured: InsuredSearchResponses) {
    this.navigationService.clearReuse();
    this.router.navigate(['/insured/information'],{ state: { pacerInsured: insured } });
  }


  onSort({ sortColumn, sortDirection }: SortEvent) {
    // resetting other headers
    this.headers?.forEach((header) => {
      if (header.sortable !== sortColumn) {
        header.direction = '';
      }
    });
    this.pacerSearchResultsService.sortColumn = sortColumn;
    this.pacerSearchResultsService.sortDirection = sortDirection;
  }
}

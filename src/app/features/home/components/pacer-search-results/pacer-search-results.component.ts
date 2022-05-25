import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { InsuredSearchResponses } from '../../models/search-results';


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

  @Input('pacerSearchResults') pacerSearchResults: InsuredSearchResponses[] = [];


  constructor(private router: Router, private navigationService: NavigationService, private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
  }

  ngOnInit(): void {
    console.log(this.pacerSearchResults);
  }

  routeToNewInsuredFromPacer(pacerInsured: InsuredSearchResponses) {
    this.navigationService.resetPolicy();
    console.log(pacerInsured);
    this.router.navigate(['/insured/information'], {queryParams: pacerInsured});
  }
}
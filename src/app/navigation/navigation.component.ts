import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { faFileAlt, faFileImport, faHome, faToolbox, faAngleDown, faAngleUp, faFolderOpen, faFolder, faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { UserAuth } from '../authorization/user-auth';
import { Subscription } from 'rxjs';
import { PolicyHistoryService } from './policy-history/policy-history.service';
import { RouteReuseStrategy } from '@angular/router';
import { DropDownsService } from '../drop-downs/drop-downs.service';
import { CustomReuseStrategy } from '../app-reuse-strategy';
import { PolicyHistory } from './policy-history/policy-history';

@Component({
  selector: 'rsps-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['../app.component.css', './navigation.component.css']
})
export class NavigationComponent implements OnInit {
  reportNavbarOpen = false;
  applicationNavbarOpen = false;
  isAuthenticated: boolean = false;
  faFileAlt = faFileAlt;
  faFileImport = faFileImport;
  faHome = faHome;
  faToolbox = faToolbox;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faFolderOpen = faFolderOpen;
  faFolder = faFolder;
  faSolidStar = faSolidStar;
  faStar = faStar;
  authSub: Subscription;
  policyHistory: PolicyHistory[] = [];
  policySub!: Subscription;
  showFav: boolean = false;

  constructor(public oktaAuth: OktaAuthService, private userAuth: UserAuth, private currentPolicy: PolicyHistoryService, private routeReuseStrategy: RouteReuseStrategy, private dropDownService: DropDownsService) {
    this.authSub = this.userAuth.isApiAuthenticated$.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );
    currentPolicy.loadInfo();
  }

  async ngOnInit() {
    this.policySub = this.currentPolicy.policyHistory$.subscribe({
      next: results => {
        this.policyHistory = results;
      }
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.policySub?.unsubscribe();
  }

  toggleReportNavbar() {
    this.reportNavbarOpen = !this.reportNavbarOpen;
  }

  toggleApplicationNavbar() {
    this.applicationNavbarOpen = !this.applicationNavbarOpen;
  }

  openPolicy(): void {
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('information');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('coverages');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('schedules');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('reinsurance');
    (this.routeReuseStrategy as CustomReuseStrategy).clearSavedHandle('summary');
    this.dropDownService.clearPolicyDropDowns();
  }

  favorite(policy: PolicyHistory) {
    policy.favorite = this.currentPolicy.favoritePolicyHistory(policy.policyId, policy.endorsementNumber, true)
  }
  unfavorite(policy: PolicyHistory) {
    policy.favorite = this.currentPolicy.favoritePolicyHistory(policy.policyId, policy.endorsementNumber, false)
  }

  hoverFavorite(policy: PolicyHistory) {
    policy.hover = true;
  }
  unhoverFavorite(policy: PolicyHistory) {
    policy.hover = false;
  }
}

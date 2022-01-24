import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { faFileAlt, faFileImport, faHome, faToolbox, faAngleDown, faAngleUp, faFolderOpen, faFolder, faStar as faSolidStar, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { UserAuth } from '../authorization/user-auth';
import { Subscription } from 'rxjs';
import { PolicyHistoryService } from './policy-history/policy-history.service';
import { Router } from '@angular/router';
import { PolicyHistory } from './policy-history/policy-history';
import { NavigationService } from '../policy/services/navigation.service';

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
  faFolderPlus = faFolderPlus;
  authSub: Subscription;
  editSub: Subscription;
  policyHistory: PolicyHistory[] = [];
  policySub!: Subscription;
  showFav: boolean = false;
  canEditPolicy: boolean = false;

  constructor(public oktaAuth: OktaAuthService, private userAuth: UserAuth, private currentPolicy: PolicyHistoryService, private navigationService: NavigationService, private router: Router) {
    this.authSub = this.userAuth.isApiAuthenticated$.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );
    this.editSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
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
    this.editSub.unsubscribe();
    this.policySub?.unsubscribe();
  }

  toggleReportNavbar() {
    this.reportNavbarOpen = !this.reportNavbarOpen;
  }

  toggleApplicationNavbar() {
    this.applicationNavbarOpen = !this.applicationNavbarOpen;
  }

  openPolicy(): void {
    this.navigationService.resetPolicy();
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

  createDirectPolicy() {
    this.router.navigate(['/home']).then(() => {
      setTimeout(() => { 
        this.navigationService.create(); 
      });
    });
  }
}
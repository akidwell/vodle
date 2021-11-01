import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { faFileAlt, faFileImport, faHome, faToolbox, faAngleDown, faAngleUp, faFolderOpen, faFolder } from '@fortawesome/free-solid-svg-icons';
import { UserAuth } from '../authorization/user-auth';
import { Subscription } from 'rxjs';
import { PolicyHistory, PolicyHistoryService } from './policy-history.service';

@Component({
  selector: 'rsps-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['../app.component.css', './navigation.component.css']
})
export class NavigationComponent implements OnInit {
  reportNavbarOpen = false;
  applicationNavbarOpen = false;
  isAuthenticated: boolean = false;
  userName: string | undefined;
  faFileAlt = faFileAlt;
  faFileImport = faFileImport;
  faHome = faHome;
  faToolbox = faToolbox;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faFolderOpen = faFolderOpen;
  faFolder = faFolder;
  authSub: Subscription;
  policyHistory: PolicyHistory[] = [];
  policySub!: Subscription;

  constructor(public oktaAuth: OktaAuthService, private userAuth: UserAuth, private currentPolicy: PolicyHistoryService) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.isApiAuthenticated$.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );
    currentPolicy.loadInfo();
  }

  async ngOnInit() {
    this.policySub = this.currentPolicy.policyHistory$.subscribe({
      next: results => {
        this.policyHistory = results;
      },
      // error: err => this.errorMessage = err
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

}

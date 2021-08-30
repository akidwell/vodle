import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';
import { faFileAlt, faFileImport, faHome, faToolbox, faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { UserAuth } from '../authorization/user-auth';
import { Subscription } from 'rxjs';

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
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;
  authSub: Subscription;

  constructor(public oktaAuth: OktaAuthService, private userAuth: UserAuth) {
    // GAM - TEMP -Subscribe
    this.authSub = this.userAuth.isApiAuthenticated$.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated
    );
  }

  async ngOnInit() {}

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  toggleReportNavbar() {
    this.reportNavbarOpen = !this.reportNavbarOpen;
  }

  toggleApplicationNavbar() {
    this.applicationNavbarOpen = !this.applicationNavbarOpen;
  }

}

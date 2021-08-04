import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'rsps-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['../app.component.css','./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  reportNavbarOpen = false;
  applicationNavbarOpen = false;
  isAuthenticated: boolean = false;
  userName: string | undefined;

    constructor(public oktaAuth: OktaAuthService) {
      // Subscribe to authentication state changes
      this.oktaAuth.$authenticationState.subscribe(
        (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated,
  
      );
    }
  
    async ngOnInit() {

    }
  

  toggleReportNavbar() {
    this.reportNavbarOpen = !this.reportNavbarOpen;
  }

  toggleApplicationNavbar() {
    this.applicationNavbarOpen = !this.applicationNavbarOpen;
  }
}

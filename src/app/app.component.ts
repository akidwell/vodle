import { Component } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'rsps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RSPS';
  isAuthenticated: boolean = false;
  userName: string | undefined;


  constructor(public oktaAuth: OktaAuthService) {
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean) => this.isAuthenticated = isAuthenticated,

    );
  }

  async ngOnInit() {
    const accessToken = this.oktaAuth.getAccessToken();
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();

    const userClaims = await this.oktaAuth.getUser();

    // user name is exposed directly as property
    this.userName = userClaims.name;

    
  }

  login() {
    this.oktaAuth.signInWithRedirect({
      originalUri: '/home'
    });    

    
  }
}

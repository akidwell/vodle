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
  errorMessage = '';

  constructor(public oktaAuth: OktaAuthService) {
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe({
     next: (isAuthenticated: boolean) => {this.isAuthenticated = isAuthenticated
    },
    error: err => this.errorMessage = err
  });
}
    
}

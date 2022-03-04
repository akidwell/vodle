import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthService } from './authorization/auth.service'


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
  loading: boolean = false;

  constructor(private oktaAuth: AuthService, private router: Router) {
    // Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe({
      next: (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated
      },
      error: (err: string) => this.errorMessage = err
    });

    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          var nav = event as NavigationStart;
          if (nav.url.startsWith('/policy') && !nav.url.endsWith('/summary')) {
            this.loading = true;
          }
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    })
  }

}

import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'rsps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RSPS';
  loading: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          var nav = event as NavigationStart;
          if (nav.url.startsWith('/policy') && !nav.url.endsWith('/summary')) {
            this.loading = true;
          }
          if (nav.url.startsWith('/insured')) {
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

import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { PreviousRouteService } from './features/insured/services/previous-route/previous-route.service';

@Component({
  selector: 'rsps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RSPS';
  loading: boolean = false;

  private previousUrl!: string;
  private currentUrl!: string;

  constructor(private router: Router, private previousRouteService: PreviousRouteService) {
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
        case event instanceof NavigationEnd: {
          var navEnd = event as NavigationEnd;
          this.previousUrl = this.currentUrl;
          this.currentUrl = navEnd.url;
          if (this.previousUrl !== undefined && !this.previousUrl?.startsWith('/insured')) {
            this.previousRouteService.setPreviousUrl(this.previousUrl);
          }
          this.loading = false;
          break;
        }
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

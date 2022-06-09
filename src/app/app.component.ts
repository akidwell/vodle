import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { UpdateService } from './core/services/update/update.service';
import { PreviousRouteService } from './core/services/previous-route/previous-route.service';

@Component({
  selector: 'rsps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RSPS';
  loading = false;

  private previousUrl!: string;
  private currentUrl!: string;

  constructor(private router: Router, private previousRouteService: PreviousRouteService, private updateService: UpdateService) {
    this.updateService.startTimer();
    this.updateService.startConfirmation();
    this.updateService.startLogging();
    this.updateService.startUnrecoverableStateCheck();

    this.router.events.subscribe(event => {
      switch (true) {
      case event instanceof NavigationStart: {
        const nav = event as NavigationStart;
        if (nav.url.startsWith('/policy') && !nav.url.endsWith('/summary')) {
          this.loading = true;
        }
        if (nav.url.startsWith('/insured')) {
          this.loading = true;
        }
        break;
      }
      case event instanceof NavigationEnd: {
        const navEnd = event as NavigationEnd;
        this.previousUrl = this.currentUrl;
        this.currentUrl = navEnd.url;
        const previousPath = this.previousUrl?.split('/');
        const currentPath = this.currentUrl?.split('/');
        if (this.previousUrl !== undefined && previousPath[1] != currentPath[1]) {
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
    });
  }

}

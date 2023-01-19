import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { UpdateService } from './core/services/update/update.service';
import { PreviousRouteService } from './core/services/previous-route/previous-route.service';
import { HeaderPaddingService } from './core/services/header-padding-service/header-padding.service';
import { PageDataService } from './core/services/page-data-service/page-data-service';
import { LayoutEnum } from './core/enums/layout-enum';
import { UserAuth } from './core/authorization/user-auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rsps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RSPS';
  loading = false;
  widthOffset = LayoutEnum.sidebar_width;
  buttonBarOffset = LayoutEnum.button_bar_height;
  private previousUrl!: string;
  private currentUrl!: string;
  isAuthenticating = false;
  authenticatingSub: Subscription;

  constructor(private router: Router, private previousRouteService: PreviousRouteService, private updateService: UpdateService,
    public headerPaddingService: HeaderPaddingService, public pageDataService: PageDataService, private userAuth: UserAuth) {

    this.authenticatingSub = this.userAuth._isAuthenticating$.subscribe(
      async (isAuthenticating: boolean) => {
        this.isAuthenticating = isAuthenticating;
      }
    );

    this.updateService.startTimer();
    this.updateService.startConfirmation();
    this.updateService.startLogging();
    this.updateService.startUnrecoverableStateCheck();

    this.headerPaddingService.sidebarPadding$.subscribe(padding => {
      this.widthOffset = padding;
    });

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
        if (nav.url.startsWith('/submission')) {
          this.loading = true;
        }
        if (nav.url.startsWith('/quote')) {
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

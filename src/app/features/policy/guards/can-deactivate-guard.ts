import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { InformationComponent } from '../components/information-base/information.component';
import { CoveragesComponent } from '../components/coverages-base/coverages.component';
import { SchedulesComponent } from '../components/schedules-base/schedules.component';
import { SummaryComponent } from '../components/summary-base/summary.component';
import { NavigationConfirmationService } from '../../../core/services/navigation-confirmation/navigation-confirmation.service';

@Injectable()
export class CanDeactivateGuard  {

  constructor(private router: Router, private navigationConfirmationService: NavigationConfirmationService) { }

  canDeactivate(
    component: InformationComponent | CoveragesComponent | SchedulesComponent | SummaryComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    // Skip checks if bypassFormGuard is set
    if (this.router.getCurrentNavigation()?.extras?.state?.bypassFormGuard) {
      return true;
    }
    if (component.isValid()) {
      if (component.isDirty()) {
        component.save();
      }
      // No error and no longer dirty then hide any errors and navigate to next route
      component.hideInvalid();
      return true;
    }
    // Show errors
    component.showInvalidControls();
    window.scroll(0,0);
    // Check to see if trying to leave policy
    if (this.checkLeavePolicy(state.url, nextState.url)) {
      return this.confirmLeave().then(confirm => {
        if (confirm) {
          component.hideInvalid();
        }
        return confirm;
      });
    }
    return false;
  }

  checkLeavePolicy(startUrl: string, endUrl: string): boolean {
    const startRoute = startUrl.split('/');
    const endRoute = endUrl.split('/');
    // if nagivating outstide policy then open confirm leave dialog
    if (!endUrl.startsWith('/policy')) {
      return true;
    }
    // if nagivating different policy or endorsement then open confirm leave dialog
    else if (startRoute[1] != endRoute[1] || startRoute[2] != endRoute[2]) {
      return true;
    }
    return false;
  }

  async confirmLeave(): Promise<boolean> {
    return await this.navigationConfirmationService.open('Leave Confirmation','Unable to save due to errors! Do you wish to leave and lose all changes?');
  }

}
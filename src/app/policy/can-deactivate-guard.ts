import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { InformationComponent } from './information/information.component';
import { CoveragesComponent } from './coverages/coverages.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SummaryComponent } from './summary/summary.component';
import { NavigationConfirmationService } from '../navigation/navigation-confirmation/navigation-confirmation.service';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<InformationComponent> {

  constructor(private navigationConfirmationService: NavigationConfirmationService) { }

  canDeactivate(
    component: InformationComponent | CoveragesComponent | SchedulesComponent | SummaryComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    if (component.isValid()) {
      if (component.isDirty()) {
        component.save();
      }
      // No error and no longer dirty then hide any errors and navigate to next route
      component.hideInvalid();
      return true;
    }
    // Show errors
    component.showInvalidControls()
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
    if (!endUrl.startsWith("/policy")) {
      return true;
    }
    // if nagivating different policy or endorsement then open confirm leave dialog
    else if (startRoute[1] != endRoute[1] || startRoute[2] != endRoute[2]) {
      return true;
    }
    return false;
  }

  async confirmLeave(): Promise<boolean> {
    return await this.navigationConfirmationService.open();
  }

}
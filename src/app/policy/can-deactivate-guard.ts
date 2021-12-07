import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { InformationComponent } from './information/information.component';
import { CoveragesComponent } from './coverages/coverages.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SummaryComponent } from './summary/summary.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<InformationComponent> {

  constructor() { }

  canDeactivate(
    component: InformationComponent | CoveragesComponent | SchedulesComponent | SummaryComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (component.isValid()) {
      if (component.isDirty()) {   
        component.save();
      }
      component.hideInvalid();
      return true;
    }
    console.log(nextState.url);
    component.showInvalidControls()
    return false;
  }
}
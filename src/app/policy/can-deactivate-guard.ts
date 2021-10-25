import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { InformationComponent } from './information/information.component';
import { CoveragesComponent } from './coverages/coverages.component';
import { SchedulesComponent } from './schedules/schedules.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<InformationComponent> {

  canDeactivate(
    component: InformationComponent | CoveragesComponent | SchedulesComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (component.isValid()) {
      if (component.isDirty()) {
        component.hideInvalid();
        component.save();
      }
      return true;
    }
    component.showInvalidControls()
    return false;
  }
}
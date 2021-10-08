import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { InformationComponent } from './information/information.component';
import { CoveragesComponent } from './coverages/coverages.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<InformationComponent> {

  canDeactivate(
    component: InformationComponent | CoveragesComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (component.isValid()) {
      if (component.isDirty()) {
        console.log("SAVE");
        component.save();
      }
      return true;
    }
    const confirmation = window.confirm(component.invalidControls().join(",") || 'Is it OK?');
    return false;
  }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { InformationComponent } from './information/information.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<InformationComponent> {

  canDeactivate(
    component: InformationComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (component.isValid()) {
      return true;
    }
    const confirmation = window.confirm(component.invalidControls().join(",") || 'Is it OK?');
    return false;
  }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NavigationConfirmationService } from '../../../core/services/navigation-confirmation/navigation-confirmation.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { QuoteInformationComponent } from '../components/common/quote-information-base/quote-information.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<QuoteInformationComponent> {

  constructor(private router: Router, private navigationConfirmationService: NavigationConfirmationService, private pageDataService: PageDataService) { }

  canDeactivate(
    component: QuoteInformationComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    if (component instanceof QuoteInformationComponent) {
      // Skip checks if bypassFormGuard is set
      if (this.router.getCurrentNavigation()?.extras?.state?.bypassFormGuard) {
        return true;
      }
      const department = this.pageDataService.quoteData || null;
      if (department && department.isValid) {
        if (department.isDirty) {
          if (this.checkLeavePolicy(state.url, nextState.url)) {
            return this.confirmLeave().then(confirm => {
              if (confirm) {
                //component.hideInvalid();
              }
              return confirm;
            });
          }
        }
        // No error and no longer dirty then hide any errors and navigate to next route
        //component.hideInvalid();
        return true;
      }
      // Show errors
      //component.showInvalidControls();
      window.scroll(0, 0);
      // Check to see if trying to leave policy
      if (this.checkLeavePolicy(state.url, nextState.url)) {
        return this.confirmLeave().then(confirm => {
          if (confirm) {
            //component.hideInvalid();
          }
          return confirm;
        });
      }

      return false;
    }
    return true;
  }

  checkLeavePolicy(startUrl: string, endUrl: string): boolean {
    const startRoute = startUrl.split('/');
    const endRoute = endUrl.split('/');
    // if nagivating outstide policy then open confirm leave dialog
    if (!endUrl.startsWith('/quote') || endUrl.endsWith('/quote')) {
      return true;
    }
    // if nagivating different policy or endorsement then open confirm leave dialog
    else if (startRoute[1] != endRoute[1] || startRoute[2] != endRoute[2]) {
      return true;
    }
    return false;
  }

  async confirmLeave(): Promise<boolean> {
    const option = await this.navigationConfirmationService.open('Leave Confirmation', 'Do you want to leave without saving?');
    if(option) {
      this.pageDataService.quoteData?.markClean();
      ///TODO: Need to reset class
    }
    return option;
  }

}

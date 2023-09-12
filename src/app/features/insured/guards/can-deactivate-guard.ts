import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NavigationConfirmationService } from '../../../core/services/navigation-confirmation/navigation-confirmation.service';
import { InsuredInformationComponent } from '../components/insured-information/insured-information.component';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';

@Injectable()
export class CanDeactivateGuard  {

  constructor(private router: Router, private navigationConfirmationService: NavigationConfirmationService, private pageDataService: PageDataService) { }

  canDeactivate(
    component: InsuredInformationComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    if (component instanceof InsuredInformationComponent) {
      // Skip checks if bypassFormGuard is set
      if (this.router.getCurrentNavigation()?.extras?.state?.bypassFormGuard) {
        return true;
      }
      const insured = this.pageDataService.insuredData || null;
      if (insured != null) {
        if (insured && insured.isValid) {
          if (insured.isDirty) {
            if (this.checkLeaveInsured(state.url, nextState.url)) {
              return this.confirmLeave().then(confirm => {
                if (confirm) {
                  insured.hideErrorMessage();
                }
                return confirm;
              });
            }
          }
          // No error and no longer dirty then hide any errors and navigate to next route
          insured.hideErrorMessage();
          return true;
        }
        // Show errors
        insured.showErrorMessage();
        window.scroll(0, 0);
        // Check to see if trying to leave policy
        if (this.checkLeaveInsured(state.url, nextState.url)) {
          return this.confirmLeave().then(confirm => {
            if (confirm) {
              insured.hideErrorMessage();
            }
            return confirm;
          });
        }
      }
      return false;
    }
    return true;
  }

  checkLeaveInsured(startUrl: string, endUrl: string): boolean {
    const startRoute = startUrl.split('/');
    const endRoute = endUrl.split('/');
    // if nagivating outstide policy then open confirm leave dialog
    if (!endUrl.startsWith('/insured') || endUrl.endsWith('/submissions')) {
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
      this.pageDataService.insuredData?.resetClass();
      this.pageDataService.insuredData?.markClean();
    }
    return option;
  }
}

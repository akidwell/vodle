import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { PolicyV2Component } from '../components/policy-base/policy-v2.component';
import { PolicyInformationV2Component } from '../components/common/policy-information-v2/policy-information-v2.component';
import { PolicyReinsuranceComponent } from '../components/common/policy-reinsurance/policy-reinsurance.component';
import { PolicySummaryComponent } from '../components/common/policy-summary/policy-summary.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NavigationConfirmationService } from 'src/app/core/services/navigation-confirmation/navigation-confirmation.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { PolicyPremiumComponent } from '../components/property/policy-premium/policy-premium.component';
import { PolicyPropertyLocationCoverageComponent } from '../components/property/policy-property-location-coverage/policy-property-location-coverage.component';
import { PolicyPropertyMortgageeComponent } from '../components/property/policy-property-mortgagee/policy-property-mortgagee.component';
import { PolicySavingService } from '../services/policy-saving-service/policy-saving.service';
import { PolicyValidationService } from '../services/policy-validation-service/policy-validation.service';
import { PolicyClass } from '../classes/policy-class';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<PolicyInformationV2Component> {

  constructor(private router: Router, private navigationConfirmationService: NavigationConfirmationService, private pageDataService: PageDataService,
    private policySavingService: PolicySavingService, private policyValidateService: PolicyValidationService) { }

  canDeactivate(
    component: PolicyInformationV2Component | PolicyPremiumComponent | PolicyPropertyLocationCoverageComponent | PolicyPropertyMortgageeComponent | PolicySummaryComponent
    | PolicyReinsuranceComponent | PolicyV2Component,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    // Skip checks if bypassFormGuard is set
    if (this.router.getCurrentNavigation()?.extras?.state?.bypassFormGuard) {
      console.log('SKKKKKIIIIPPPPPPPPPP');
      return true;
    }
    else {
      console.log(component);
      if (component instanceof PolicyInformationV2Component || component instanceof PolicyPropertyLocationCoverageComponent || component instanceof PolicyPropertyMortgageeComponent)
        if(this.validateAndSavePolicy()){
          return true;
        }
    }
    window.scroll(0,0);
    // Check to see if trying to leave policy
    if (this.checkLeavePolicy(state.url, nextState.url)) {
      return this.confirmLeave().then(confirm => {
        //TODO: once all the components listed above have the policyInfo data in the component
        //we can remove the "instance of ____" piece
        if (confirm && component instanceof PolicyInformationV2Component) {
          component.policyInfo.errorMessagesList = [];
        }
        return confirm;
      });
    }
    return false;
  }

  validateAndSavePolicy(): boolean {
    const policy = this.pageDataService.policyData || undefined;
    const results = policy?.validateObject();
    console.log('RESULTS', policy, results);
    //TODO: Add isDirty check as we don't want to save every tab change
    //if canBeSaved is false we skip the save
    if (results?.length == 0 && policy?.isDirty) {
      this.policySavingService.savePolicy();
    }
    //if isValid is false we prevent them from leaving tab
    return results?.length == 0;

  }

  checkLeavePolicy(startUrl: string, endUrl: string): boolean {
    const startRoute = startUrl.split('/');
    const endRoute = endUrl.split('/');
    // if nagivating outstide policy then open confirm leave dialog
    if (!endUrl.startsWith('/policy-v2')) {
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

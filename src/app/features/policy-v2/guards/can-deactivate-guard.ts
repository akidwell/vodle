import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { PolicyInformationV2Component } from '../components/common/policy-information-v2/policy-information-v2.component';
import { PolicyReinsuranceComponent } from '../components/common/policy-reinsurance/policy-reinsurance.component';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NavigationConfirmationService } from 'src/app/core/services/navigation-confirmation/navigation-confirmation.service';
import { PolicyPropertyLocationCoverageComponent } from '../components/property/policy-property-location-coverage/policy-property-location-coverage.component';
import { PolicyPropertyMortgageeComponent } from '../components/property/policy-property-mortgagee/policy-property-mortgagee.component';
import { PolicySavingService } from '../services/policy-saving-service/policy-saving.service';
import { PolicyValidationService } from '../services/policy-validation-service/policy-validation.service';
import { PolicyValidationClass } from '../classes/policy-validation-class';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { PolicyPremiumComponent } from '../components/property/policy-premium/policy-premium.component';
import { PolicySummaryComponent } from '../components/common/policy-summary/policy-summary.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<PolicyInformationV2Component> {

  constructor(private router: Router,
    private navigationConfirmationService: NavigationConfirmationService,
    private policySavingService: PolicySavingService) { }

  canDeactivate(
    component: PolicyInformationV2Component | PolicyPropertyLocationCoverageComponent | PolicyPropertyMortgageeComponent | PolicyReinsuranceComponent | PolicyPremiumComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    // Skip checks if bypassFormGuard is set
    if (this.router.getCurrentNavigation()?.extras?.state?.bypassFormGuard) {
      return true;
    }
    const isLeaving = this.checkLeavePolicy(state.url, nextState.url);
    let currentValidation: PolicyValidationClass | null = null;
    let errors: ErrorMessage[] = [];
    console.log('line 36', component);
    const policy = component.policyInfo;
    policy.fullTabValidation();
    policy.validateObject();

    if(component instanceof PolicyInformationV2Component) {
      currentValidation = component.policyInfo.policyInfoValidation;
      errors = component.policyInfo.getTabErrors('PolicyInfo');
      component.showErrors = true;
    } else if (component instanceof PolicyPropertyLocationCoverageComponent) {
      currentValidation = component.policyInfo.coveragesValidation;
      errors = component.policyInfo.getTabErrors('Coverages');
    } else if (component instanceof PolicyPropertyMortgageeComponent) {
      currentValidation = component.policyInfo.mortgageeValidation;
      errors = component.policyInfo.getTabErrors('MortgageeAi');
    }else if (component instanceof PolicyPremiumComponent) {
      currentValidation = component.policyInfo.premiumValidation;
      errors = component.policyInfo.getTabErrors('Premium');
    } else if (component instanceof PolicyReinsuranceComponent) {
      currentValidation = component.policyInfo.reinsuranceValidation;
      // TODO
      // this if will need tweaked depending on how defaulting the layers go
      // place holder now for aesthetic purposes if a user is in the app demoing
      if(component.policyInfo.endorsementData.policyLayers.length == 0){
        component.showErrors = false;
      } else {
        errors = component.policyInfo.getTabErrors('Reinsurance');
        component.showErrors = true;
      }
    }
    return this.saveIfDirty(component, currentValidation, isLeaving, errors).then((response) => {
      return response;
    });
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

  async saveIfDirty(component: PolicyInformationV2Component | PolicyPropertyLocationCoverageComponent | PolicyPropertyMortgageeComponent | PolicyReinsuranceComponent | PolicyPremiumComponent,
    currentValidation: PolicyValidationClass | null, isLeaving: boolean, errors: ErrorMessage[]): Promise<boolean> {
    const policy = component.policyInfo;
    window.scrollTo(0,0);
    console.log('line96', policy.canBeSaved, errors, isLeaving);
    if(errors.length != 0 && !isLeaving){
      return false;
    } else if (policy?.isDirty && policy.canBeSaved && errors.length == 0) {
      await this.policySavingService.savePolicy();
      return true;
    }
    else if(errors.length != 0 && isLeaving) {
      return await this.confirmLeave();
    } else {
      return true;
    }
  }

}

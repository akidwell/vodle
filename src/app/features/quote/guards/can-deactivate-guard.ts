import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NavigationConfirmationService } from '../../../core/services/navigation-confirmation/navigation-confirmation.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { QuoteInformationComponent } from '../components/common/quote-information-base/quote-information.component';
import { QuoteSavingService } from '../services/quote-saving-service/quote-saving-service.service';
import { QuoteDataValidationService } from '../services/quote-data-validation-service/quote-data-validation-service.service';
import { QuoteProgramBaseComponent } from '../components/quote-program-base/quote-program-base.component';
import { QuoteSummaryComponent } from '../components/common/quote-summary-base/quote-summary.component';
import { QuotePropertyLocationCoverageComponent } from '../components/property/quote-property-location-coverage/quote-property-location-coverage.component';
import { QuoteFormsComponent } from '../components/common/quote-forms-base/quote-forms.component';
import { QuotePremiumComponent } from '../components/common/quote-premium-base/quote-premium.component';
import { TermsConditionsComponent } from '../components/common/terms-conditions-base/terms-conditions.component';
import { QuotePropertyMortgageeComponent } from '../components/property/quote-property-mortgagee/quote-property-mortgagee.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<QuoteInformationComponent> {

  constructor(private router: Router, private navigationConfirmationService: NavigationConfirmationService,
    private pageDataService: PageDataService, private quoteDataValidationService: QuoteDataValidationService, private quoteSavingService: QuoteSavingService) { }

  canDeactivate(
    component: QuoteInformationComponent | QuoteProgramBaseComponent | QuoteSummaryComponent | QuotePropertyMortgageeComponent | QuotePremiumComponent | TermsConditionsComponent | QuoteFormsComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    let allowNavigate = true;
    // Skip checks if bypassFormGuard is set
    if (this.router.getCurrentNavigation()?.extras?.state?.bypassFormGuard) {
      return true;
    }

    if (this.quoteSavingService.isSaving) {
      return true;
    }
    if (component instanceof QuoteInformationComponent || component instanceof QuoteSummaryComponent || component instanceof QuotePropertyLocationCoverageComponent
      || component instanceof QuotePropertyMortgageeComponent || component instanceof QuotePremiumComponent || component instanceof TermsConditionsComponent
      || component instanceof QuoteFormsComponent) {
      allowNavigate = this.validateAndSaveDepartment();
      // // Show errors
      window.scroll(0, 0);
      // Check to see if trying to leave policy
      if (this.checkLeavePolicy(state.url, nextState.url) && !allowNavigate) {
        return this.confirmLeave().then(confirm => {
          if (confirm) {
            allowNavigate = true;
          }
          return confirm;
        });
      }
    }
    // if (component instanceof QuoteProgramBaseComponent) {
    //   // Skip checks if bypassFormGuard is set
    //   console.log('can deactivate quote');
    //   allowNavigate = this.validateAndSaveDepartment();
    // }
    return allowNavigate;
  }

  checkLeavePolicy(startUrl: string, endUrl: string): boolean {
    const startRoute = startUrl.split('/');
    const endRoute = endUrl.split('/');
    console.log(startRoute, endRoute);
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
  validateAndSaveDepartment(): boolean {
    const department = this.pageDataService.quoteData || null;
    department?.validate();
    //TODO: Add isDirty check as we don't want to save every tab change
    //if canBeSaved is false we skip the save
    if (department?.validationResults.isDirty && department?.validationResults.canBeSaved) {
      this.quoteSavingService.saveDepartment();
    }
    console.log('line 88',department?.validationResults.canBeSaved);
    //if isValid is false we prevent them from leaving tab
    return department?.validationResults.canBeSaved || false;
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NavigationConfirmationService } from '../../../core/services/navigation-confirmation/navigation-confirmation.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { QuoteSavingService } from '../services/quote-saving-service/quote-saving-service.service';
import { QuoteDataValidationService } from '../services/quote-data-validation-service/quote-data-validation-service.service';
import { QuotePropertyLocationCoverageComponent } from '../components/property/quote-property-location-coverage/quote-property-location-coverage.component';
import { QuotePropertyMortgageeComponent } from '../components/property/quote-property-mortgagee/quote-property-mortgagee.component';
import { QuotePremiumComponent } from '../components/common/quote-premium-base/quote-premium.component';
import { TermsConditionsComponent } from '../components/common/terms-conditions-base/terms-conditions.component';
import { QuoteFormsComponent } from '../components/common/quote-forms-base/quote-forms.component';

@Injectable()
export class CanDeactivateChildGuard implements CanDeactivate<QuotePropertyLocationCoverageComponent> {

  constructor(private router: Router, private navigationConfirmationService: NavigationConfirmationService,
    private pageDataService: PageDataService, private quoteDataValidationService: QuoteDataValidationService, private quoteSavingService: QuoteSavingService) { }

  canDeactivate(
    component: QuotePropertyLocationCoverageComponent | QuotePropertyMortgageeComponent | QuotePremiumComponent | TermsConditionsComponent | QuoteFormsComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    let allowNavigate = true;
    if (this.router.getCurrentNavigation()?.extras?.state?.bypassFormGuard) {
      return true;
    }
    if (component instanceof QuotePropertyLocationCoverageComponent || component instanceof QuotePropertyMortgageeComponent ||
      component instanceof QuotePremiumComponent || component instanceof TermsConditionsComponent || component instanceof QuoteFormsComponent) {
      // Skip checks if bypassFormGuard is set
      console.log(this.checkLeavePolicy(state.url, nextState.url));

      if (this.quoteSavingService.isSaving) {
        return false;
      }

      if (!this.checkLeavePolicy(state.url, nextState.url)) {
        allowNavigate = this.validateAndSaveQuote();
      }
      // // Show errors
      // //component.showInvalidControls();
      // window.scroll(0, 0);
      // // Check to see if trying to leave policy
      // if (this.checkLeavePolicy(state.url, nextState.url)) {
      //   return this.confirmLeave().then(confirm => {
      //     if (confirm) {
      //       //component.hideInvalid();
      //     }
      //     return confirm;
      //   });
      // }

      // return true;
    }

    return allowNavigate;
  }

  validateAndSaveQuote(): boolean {
    const program = this.pageDataService.selectedProgram || null;
    program?.quoteData?.validate();
    //TODO: Add isDirty check as we don't want to save every tab change
    //if canBeSaved is false we skip the save
    if (program?.quoteData?.validationResults.isDirty && program?.quoteData?.validationResults.canBeSaved) {
      this.quoteSavingService.saveQuote();
    }
    console.log(program?.quoteData?.validationResults);
    //if isValid is false we prevent them from leaving tab
    return true;
  }
  checkLeavePolicy(startUrl: string, endUrl: string): boolean {
    const startRoute = startUrl.split('/');
    const endRoute = endUrl.split('/');
    console.log(startRoute[4], endRoute[4]);
    // if nagivating outstide policy then open confirm leave dialog
    if (!endUrl.startsWith('/quote') || endUrl.endsWith('/quote')) {
      return true;
    }
    // if nagivating different policy or endorsement then open confirm leave dialog
    else if (startRoute[2] != endRoute[2] || startRoute[4] != endRoute[4]) {
      return true;
    }
    return false;
  }
}

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

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<QuoteInformationComponent> {

  constructor(private router: Router, private navigationConfirmationService: NavigationConfirmationService,
    private pageDataService: PageDataService, private quoteDataValidationService: QuoteDataValidationService, private quoteSavingService: QuoteSavingService) { }

  canDeactivate(
    component: QuoteInformationComponent | QuoteProgramBaseComponent | QuoteSummaryComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    let allowNavigate = true;
    if (this.router.getCurrentNavigation()?.extras?.state?.bypassFormGuard) {
      return true;
    }
    if (component instanceof QuoteInformationComponent || component instanceof QuoteSummaryComponent) {
      // Skip checks if bypassFormGuard is set
      console.log('can deactivate department');

      allowNavigate = this.validateAndSaveDepartment();
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
    if (component instanceof QuoteProgramBaseComponent) {
      // Skip checks if bypassFormGuard is set
      console.log('can deactivate quote');
      //TODO: implement specific quote save
      allowNavigate = this.validateAndSaveDepartment();
      // // Show errors
      // //component.showInvalidControls();
      // window.scroll(0, 0);
      // // Check to see if trying to leave policy


      // return true;
    }
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
    if (department?.validationResults.canBeSaved) {
      this.quoteSavingService.saveDepartment();
    }
    //if isValid is false we prevent them from leaving tab
    return department?.validationResults.isValid || false;
  }
  // validateQuote() {
  //   const quoteId = route.paramMap.get('quoteId') ?? '';
  //   if (quoteId && parseInt(quoteId)) {
  //     const quote = this.quoteDataValidationService.validateSingleQuote(parseInt(quoteId));
  //     console.log(quote);
  //   }

  //   if (department && department.isValid) {
  //     if (department.isDirty) {

  //       // if (component.isValid()) {
  //       //   if (component.isDirty()) {
  //       //     component.save();
  //       //   }
  //       //   // No error and no longer dirty then hide any errors and navigate to next route
  //       //   component.hideInvalid();
  //       //   return true;
  //       // }
  //     }
  //     // No error and no longer dirty then hide any errors and navigate to next route
  //     //component.hideInvalid();
  //     return true;
  //   }
  // }:
}

// import { Injectable } from '@angular/core';
// import { Observable, catchError, lastValueFrom, map, tap } from 'rxjs';
// import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
// import { NavigationConfirmationService } from '../../../core/services/navigation-confirmation/navigation-confirmation.service';
// import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
// import { QuoteSavingService } from '../services/quote-saving-service/quote-saving-service.service';
// import { QuoteDataValidationService } from '../services/quote-data-validation-service/quote-data-validation-service.service';
// import { QuotePropertyLocationCoverageComponent } from '../components/property/quote-property-location-coverage/quote-property-location-coverage.component';
// import { QuotePropertyMortgageeComponent } from '../components/property/quote-property-mortgagee/quote-property-mortgagee.component';
// import { QuotePremiumComponent } from '../components/common/quote-premium-base/quote-premium.component';
// import { TermsConditionsComponent } from '../components/common/terms-conditions-base/terms-conditions.component';
// import { QuoteFormsComponent } from '../components/common/quote-forms-base/quote-forms.component';
// import { PropertyQuoteClass } from '../classes/property-quote-class';
// import { PropertyQuote } from '../models/property-quote';
// import { QuoteService } from '../services/quote-service/quote.service';

// @Injectable()
// export class CanDeactivateChildGuard implements CanDeactivate<QuotePropertyLocationCoverageComponent> {

//   constructor(private router: Router, private route: ActivatedRoute, private navigationConfirmationService: NavigationConfirmationService, private quoteService: QuoteService,
//     private pageDataService: PageDataService, private quoteDataValidationService: QuoteDataValidationService, private quoteSavingService: QuoteSavingService) { }

//   canDeactivate(
//     component: QuotePropertyLocationCoverageComponent | QuotePropertyMortgageeComponent | QuotePremiumComponent | TermsConditionsComponent | QuoteFormsComponent,
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot,
//     nextState: RouterStateSnapshot
//   ): Observable<boolean> | boolean | Promise<boolean> {
//     console.log('in child guard' + component);
//     let allowNavigate = true;
//     // Skip checks if bypassFormGuard is set
//     if (this.router.getCurrentNavigation()?.extras?.state?.bypassFormGuard) {
//       return true;
//     }
//     if (this.quoteSavingService.isSaving) {
//       return false;
//     }
//     if (component instanceof QuotePropertyLocationCoverageComponent || component instanceof QuotePropertyMortgageeComponent ||
//       component instanceof QuotePremiumComponent || component instanceof TermsConditionsComponent || component instanceof QuoteFormsComponent) {
//       allowNavigate = this.validateAndSaveQuote();
//       // Show errors
//       window.scroll(0, 0);
//       // Check to see if trying to leave policy
//       if (this.checkLeavePolicy(state.url, nextState.url) && !allowNavigate) {
//         return this.confirmLeave().then(async confirm => {
//           if (confirm) {
//             // need to get back into a valid state
//             const startRoute = state.url.split('/');
//             const seq= Number(startRoute[2]);
//             const valid = this.quoteService.getQuotes(seq);
//             await lastValueFrom(valid).then((x)=> {
//               component.quote = x.programMappings[0].quoteData as PropertyQuoteClass;
//               if(this.pageDataService.selectedProgram != null){
//                 this.pageDataService.selectedProgram.quoteData = component.quote;
//                 this.pageDataService.quoteData = x;
//               }
//               component.quote.validationResults.resetValidation();
//             });
//           }
//           return confirm;
//         });
//       }
//     }
//     return true;
//   }

//   async confirmLeave(): Promise<boolean> {
//     const option = await this.navigationConfirmationService.open('Leave Confirmation', 'Do you want to leave without saving?');
//     if(option) {
//       this.pageDataService.quoteData?.markClean();
//       ///TODO: Need to reset class
//     }
//     return option;
//   }

//   validateAndSaveQuote(): boolean {
//     const program = this.pageDataService.selectedProgram || null;
//     const allow = program?.quoteData?.validate();
//     //TODO: Add isDirty check as we don't want to save every tab change
//     //if canBeSaved is false we skip the save
//     if (allow?.isDirty && allow?.canBeSaved) {
//       this.quoteSavingService.saveQuote();
//     }
//     //if isValid is false we prevent them from leaving tab
//     return allow?.canBeSaved ?? true;
//   }
//   checkLeavePolicy(startUrl: string, endUrl: string): boolean {
//     const startRoute = startUrl.split('/');
//     const endRoute = endUrl.split('/');
//     // if nagivating outstide policy then open confirm leave dialog
//     if (!endUrl.startsWith('/quote') || endUrl.endsWith('/quote')) {
//       return true;
//     }
//     // if nagivating different policy or endorsement then open confirm leave dialog
//     else if (startRoute[2] != endRoute[2] || startRoute[4] != endRoute[4]) {
//       return true;
//     }
//     return false;
//   }
// }

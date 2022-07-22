import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteResolver } from './services/quote-resolver/quote-resolver.service';
import { QuoteNotFoundComponent } from './components/common/quote-not-found/quote-not-found.component';
import { QuoteComponent } from './components/common/quote-base/quote.component';
import { QuoteInformationComponent } from './components/common/quote-information-base/quote-information.component';
import { QuoteProgramBaseComponent } from './components/quote-program-base/quote-program-base.component';
import { QuotePropertyLocationCoverageComponent } from './components/property/quote-property-location-coverage/quote-property-location-coverage.component';
import { QuoteSubmissionComponent } from './components/common/quote-submission-base/quote-submission.component';
import { TermsConditionsComponent } from './components/common/terms-conditions-base/terms-conditions.component';
import { QuoteSummaryComponent } from './components/common/quote-summary-base/quote-summary.component';
import { QuotePremiumComponent } from './components/common/quote-premium-base/quote-premium.component';
import { MortgageeGroupComponent } from 'src/app/shared/components/propertry-mortgagee/property-mortgagee-group/mortgagee-group.component';



const routes: Routes = [
  {
    path: 'quote-not-found',
    component: QuoteNotFoundComponent
  },
  {
    path: '',
    component: QuoteComponent,
    resolve: {
      quoteData: QuoteResolver
    },
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', component: QuoteInformationComponent },
    ]
  },
  {
    path: ':seq',
    component: QuoteComponent,
    resolve: {
      quoteData: QuoteResolver
    },
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', component: QuoteInformationComponent },
      { path: 'submission', component: QuoteSubmissionComponent },
      { path: 'program/:quoteId',
        component: QuoteProgramBaseComponent,
        children: [
          { path: '', redirectTo: 'location', pathMatch: 'full' },
          { path: 'location', component: QuotePropertyLocationCoverageComponent },
          { path: 'mortgagee', component: MortgageeGroupComponent },
          { path: 'premium', component: QuotePremiumComponent, data: { saveComponent: true } },
          { path: 'conditions', component: TermsConditionsComponent },
        ]
      },
      { path: 'summary', component: QuoteSummaryComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteRoutingModule { }

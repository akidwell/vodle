import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteResolver } from './services/quote-resolver/quote-resolver.service';
import { QuoteNotFoundComponent } from './components/quote-not-found/quote-not-found.component';
import { QuoteComponent } from './components/quote-base/quote.component';
import { QuoteInformationComponent } from './components/quote-information-base/quote-information.component';
import { QuoteMortgageeComponent } from './components/quote-mortgagee/quote-mortgagee.component';
import { QuotePremiumComponent } from './components/quote-premium/quote-premium.component';
import { QuoteTermsConditionsComponent } from './components/quote-terms-conditions/quote-terms-conditions.component';
import { QuoteSummaryComponent } from './components/quote-summary/quote-summary.component';
import { QuoteSubmissionComponent } from './components/quote-submission/quote-submission.component';


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
      { path: 'mortgagee', component: QuoteMortgageeComponent },
      { path: 'premium', component: QuotePremiumComponent },
      { path: 'conditions', component: QuoteTermsConditionsComponent },
      { path: 'summary', component: QuoteSummaryComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteRoutingModule { }

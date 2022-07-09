import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuoteResolver } from './services/quote-resolver/quote-resolver.service';
import { QuoteNotFoundComponent } from './components/quote-not-found/quote-not-found.component';
import { QuoteComponent } from './components/quote-base/quote.component';
import { QuoteInformationComponent } from './components/quote-information-base/quote-information.component';


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
      { path: 'information', component: QuoteInformationComponent }
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { QuoteRoutingModule } from './quote-routing.module';
import { QuoteComponent } from './components/quote-base/quote.component';
import { QuoteInformationComponent } from './components/quote-information/quote-information.component';
import { CanDeactivateGuard } from '../policy/guards/can-deactivate-guard';
import { NgxMaskModule } from 'ngx-mask';
import { QuoteNotFoundComponent } from './components/quote-not-found/quote-not-found.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BusyModule } from 'src/app/core/components/busy/busy.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { QuoteHeaderComponent } from './components/quote-header/quote-header.component';
import { QuotePropertyDetailComponent } from './components/quote-property-detail/quote-property-detail.component';
import { QuoteMortgageeComponent } from './components/quote-mortgagee/quote-mortgagee.component';
import { QuotePremiumComponent } from './components/quote-premium/quote-premium.component';
import { QuoteTermsConditionsComponent } from './components/quote-terms-conditions/quote-terms-conditions.component';
import { QuoteSummaryComponent } from './components/quote-summary/quote-summary.component';
import { QuoteSubmissionComponent } from './components/quote-submission/quote-submission.component';


@NgModule({
  declarations: [
    QuoteComponent,
    QuoteInformationComponent,
    QuoteNotFoundComponent,
    QuoteHeaderComponent,
    QuotePropertyDetailComponent,
    QuoteMortgageeComponent,
    QuotePremiumComponent,
    QuoteTermsConditionsComponent,
    QuoteSummaryComponent,
    QuoteSubmissionComponent ],
  imports: [
    CommonModule,
    QuoteRoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    NgSelectModule,
    DirectivesModule,
    BusyModule,
    PipesModule,
    DragDropModule,
    MatSlideToggleModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    CanDeactivateGuard,
    DatePipe
  ]
})
export class QuoteModule { }

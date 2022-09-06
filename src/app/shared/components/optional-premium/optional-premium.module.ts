import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from '../../directives/directives.module';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DATE_FORMATS } from 'src/app/core/constants/date-format';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { CanDeactivateGuard } from 'src/app/features/policy/guards/can-deactivate-guard';
import { AdditionalInterestModule } from '../property-additional-interest.ts/additional-interest.module';
import { OptionalPremiumComponent } from './optional-premium/optional-premium.component';
import { OptionalPremiumGroupComponent } from './optional-premium-group/optional-premium-group.component';
import { QuoteLineItemsModule } from 'src/app/features/quote/components/common/quote-line-items/quote-line-items.module';

@NgModule({
  declarations: [
    OptionalPremiumComponent,
    OptionalPremiumGroupComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule,
    DragDropModule,
    MatSlideToggleModule,
    AdditionalInterestModule,
    QuoteLineItemsModule
  ],
  providers: [
    CanDeactivateGuard,
    DatePipe,
    ConfirmationDialogService,
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
  ],
  exports: [OptionalPremiumGroupComponent]
})
export class OptionalPremiumModule { }

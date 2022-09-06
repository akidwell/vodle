import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { QuoteLineItemsComponent } from './quote-line-items/quote-line-items.component';
import { QuoteLineItemsGroupComponent } from './quote-line-items-group/quote-line-items-group.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DATE_FORMATS } from 'src/app/core/constants/date-format';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { CanDeactivateGuard } from '../../../guards/can-deactivate-guard';



@NgModule({
  declarations: [
    QuoteLineItemsComponent,
    QuoteLineItemsGroupComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    DirectivesModule,
    DragDropModule,
    MatSlideToggleModule
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
  exports: [QuoteLineItemsGroupComponent]
})
export class QuoteLineItemsModule { }

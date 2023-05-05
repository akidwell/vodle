import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { BusyModule } from 'src/app/core/components/busy/busy.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { ConfirmationDialogService } from '../../core/services/confirmation-dialog/confirmation-dialog.service';
import { AdditionalNamedInsuredModule } from 'src/app/shared/components/additional-named-insured/additional-named-insured.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PolicyV2Component } from './components/policy-v2/policy-v2.component';
import { PolicyV2RoutingModule } from './policy-routing-v2.module';

@NgModule({
  declarations: [
    PolicyV2Component
  ],
  imports: [
    CommonModule,
    PolicyV2RoutingModule,
    FormsModule,
    FontAwesomeModule,
    NgbModule,
    NgSelectModule,
    BusyModule,
    DirectivesModule,
    AdditionalNamedInsuredModule,
    PipesModule,
    DragDropModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideEnvironmentNgxMask(),
    DatePipe,
    FormatDateForDisplay,
    ConfirmationDialogService,
  ]
})
export class PolicyV2Module { }

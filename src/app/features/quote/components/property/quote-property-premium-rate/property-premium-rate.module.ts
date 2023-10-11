import { NgModule } from '@angular/core';
import { PropertyPremiumRateComponent } from './property-premium-rate.component';
import { CanDeactivateGuard } from '../../../guards/can-deactivate-guard';
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DATE_FORMATS } from 'src/app/core/constants/date-format';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
    declarations: [
        PropertyPremiumRateComponent
    ],
    imports: [
        CommonModule,
        FontAwesomeModule,
        FormsModule,
        NgbModule,
        NgSelectModule,
        DirectivesModule,
        DragDropModule,
        MatSlideToggleModule,
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
    exports: [PropertyPremiumRateComponent]
})
export class PropertyPremiumRateModule { }
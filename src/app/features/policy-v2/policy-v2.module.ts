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
import { PolicyV2Component } from './components/policy-base/policy-v2.component';
import { PolicyV2RoutingModule } from './policy-routing-v2.module';
import { PolicyInformationV2Component } from './components/common/policy-information-v2/policy-information-v2.component';
import { PolicyPropertyLocationCoverageComponent } from './components/property/policy-property-location-coverage/policy-property-location-coverage.component';
import { PolicySummaryComponent } from './components/common/policy-summary/policy-summary.component';
import { PolicyPropertyMortgageeComponent } from './components/property/policy-property-mortgagee/policy-property-mortgagee.component';
import { PolicyReinsuranceComponent } from './components/common/policy-reinsurance/policy-reinsurance.component';
import { PolicyPremiumComponent } from './components/property/policy-premium/policy-premium.component';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { PolicyLayerComponent } from './components/reinsurance/policy-layer/policy-layer.component';
import { PropertyBuildingGroupComponent } from 'src/app/shared/components/property-building/property-building-group/property-building-group.component';
import { PropertyBuildingModule } from 'src/app/shared/components/property-building/property-building.module';
import { PropertyBuildingCoverageEditModule } from 'src/app/shared/components/property-building-coverage-edit/property-building-coverage-edit.module';
import { PropertyBuildingCoverageModule } from 'src/app/shared/components/property-building-coverage/property-building-coverage.module';
import { MortgageeModule } from 'src/app/shared/components/property-mortgagee/mortgagee.module';
import { AdditionalInterestModule } from 'src/app/shared/components/property-additional-interest.ts/additional-interest.module';
import { FilteredBuildingsService } from 'src/app/shared/services/filtered-buildings/filtered-buildings.service';

@NgModule({
  declarations: [
    PolicyV2Component,
    PolicyInformationV2Component,
    PolicyPropertyLocationCoverageComponent,
    PolicySummaryComponent,
    PolicyPropertyMortgageeComponent,
    PolicyPremiumComponent,
    PolicyReinsuranceComponent,
    PolicyLayerComponent,
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
    NgxMaskPipe,
    PropertyBuildingModule,
    PropertyBuildingCoverageModule,
    PropertyBuildingCoverageEditModule,
    MortgageeModule,
    AdditionalInterestModule,
  ],
  providers: [
    provideEnvironmentNgxMask(),
    DatePipe,
    CanDeactivateGuard,
    FormatDateForDisplay,
    ConfirmationDialogService,
    FilteredBuildingsService
  ]
})
export class PolicyV2Module { }

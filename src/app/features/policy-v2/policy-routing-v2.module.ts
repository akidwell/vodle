import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyNotFoundComponent } from '../policy/components/policy-not-found/policy-not-found.component';
import { PolicyV2Component } from './components/policy-base/policy-v2.component';
import { PolicyResolver } from './services/policy-resolver/policy-resolver.service';
import { PolicyInformationV2Component } from './components/common/policy-information-v2/policy-information-v2.component';
import { AccountInformationResolver, EndorsementResolver, EndorsementStatusResolver } from '../policy/services/policy-resolver/policy-resolver.service';
import { PolicyPropertyLocationCoverageComponent } from './components/property/policy-property-location-coverage/policy-property-location-coverage.component';
import { PolicyPropertyMortgageeComponent } from './components/property/policy-property-mortgagee/policy-property-mortgagee.component';
import { PolicyReinsuranceComponent } from './components/common/policy-reinsurance/policy-reinsurance.component';
import { PolicyPremiumComponent } from './components/property/policy-premium/policy-premium.component';
import { PolicySummaryComponent } from './components/common/policy-summary/policy-summary.component';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';

const routes: Routes = [
  {
    path: 'policy-not-found',
    component: PolicyNotFoundComponent,
  },
  {
    path: ':id/:end',
    component: PolicyV2Component,
    resolve: {
      policyInfoData: PolicyResolver,
      accountData: AccountInformationResolver,
      endorsementData: EndorsementResolver,
      status: EndorsementStatusResolver
    },
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', component: PolicyInformationV2Component, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true }},
      { path: 'coverages', component:  PolicyPropertyLocationCoverageComponent, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true }},
      { path: 'mortgagee', component: PolicyPropertyMortgageeComponent },
      { path: 'premium', component: PolicyPremiumComponent },
      { path: 'reinsurance', component: PolicyReinsuranceComponent },
      { path: 'summary', component: PolicySummaryComponent},

    ],
  },
  {
    path: ':id',
    redirectTo: ':id/0',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyV2RoutingModule { }

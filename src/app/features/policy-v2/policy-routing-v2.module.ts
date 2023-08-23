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
      endorsementData: EndorsementResolver, // Kept for backwards compatibility, use endorsement in policyInfoData.
      status: EndorsementStatusResolver
    },
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', title: 'RSPS | Policy | Information', component: PolicyInformationV2Component, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true }},
      { path: 'coverages', title: 'RSPS | Policy | Coverages', component:  PolicyPropertyLocationCoverageComponent, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true }},
      { path: 'mortgagee', title: 'RSPS | Policy | Mortgagee', component: PolicyPropertyMortgageeComponent, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true } },
      { path: 'premium', title: 'RSPS | Policy | Premium', component: PolicyPremiumComponent },
      { path: 'reinsurance', title: 'RSPS | Policy | Reinsurance', component: PolicyReinsuranceComponent, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true } },
      { path: 'summary', title: 'RSPS | Policy | Summary', component: PolicySummaryComponent},
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

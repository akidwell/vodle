import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { CoveragesComponent } from './components/coverages-base/coverages.component';
import { InformationComponent } from './components/information-base/information.component';
import { PolicyNotFoundComponent } from './components/policy-not-found/policy-not-found.component';
import { AccountInformationResolver, EndorsementResolver, EndorsementCoveragesResolver, PolicyInformationResolver, AdditionalNamedInsuredsResolver, EndorsementLocationResolver, UnderlyingCoveragesResolver, PolicyLayerResolver, EndorsementStatusResolver } from './services/policy-resolver/policy-resolver.service';
import { ReinsuranceComponent } from './components/reinsurance-base/reinsurance.component';
import { SchedulesComponent } from './components/schedules-base/schedules.component';
import { SummaryComponent } from './components/summary-base/summary.component';
import { PolicyComponent } from './components/policy-base/policy.component';

const routes: Routes = [
  {
    path: 'policy-not-found',
    component: PolicyNotFoundComponent,
  },
  { path: '', component: PolicyNotFoundComponent },
  {
    path: ':id/:end',
    component: PolicyComponent,
    resolve: {
      accountData: AccountInformationResolver,
      policyInfoData: PolicyInformationResolver,
      endorsementData: EndorsementResolver,
      endorsementCoveragesGroups: EndorsementCoveragesResolver,
      aniData: AdditionalNamedInsuredsResolver,
      endorsementLocationData: EndorsementLocationResolver,
      policyLayerData: PolicyLayerResolver,
      underlyingCoverages: UnderlyingCoveragesResolver,
      status: EndorsementStatusResolver
    },
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', component: InformationComponent, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true } },
      { path: 'coverages', component: CoveragesComponent, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true } },
      { path: 'schedules', component: SchedulesComponent, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true } },
      { path: 'reinsurance', component: ReinsuranceComponent, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true } },
      { path: 'summary', component: SummaryComponent, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true } }
    ]
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
export class PolicyRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { CoveragesComponent } from './components/coverages/coverages.component';
import { InformationComponent } from './components/information/information.component';
import { PolicyNotFoundComponent } from './components/policy-not-found/policy-not-found.component';
import { AccountInformationResolver, EndorsementResolver, EndorsementCoveragesResolver, PolicyInformationResolver, AdditionalNamedInsuredsResolver, EndorsementLocationResolver, UnderlyingCoveragesResolver, PolicyLayerResolver, InvoiceResolver, EndorsementStatusResolver } from './services/policy-resolver/policy-resolver-service';
import { ReinsuranceComponent } from './components/reinsurance/reinsurance.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { SummaryComponent } from './components/summary/summary.component';
import { PolicyComponent } from './components/policy/policy.component';

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
      { path: 'reinsurance', component: ReinsuranceComponent, canDeactivate: [CanDeactivateGuard], data: { saveComponent: true }  },
      {
        path: 'summary',
        component: SummaryComponent,
        runGuardsAndResolvers: 'always',
        canDeactivate: [CanDeactivateGuard],
        resolve: { invoices: InvoiceResolver },
        data: { saveComponent: true }
      }
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

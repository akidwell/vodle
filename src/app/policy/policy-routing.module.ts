import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from './can-deactivate-guard';
import { CoveragesComponent } from './coverages/coverages.component';
import { InformationComponent } from './information/information.component';
import { PolicyNotFoundComponent } from './policy-not-found.component';
import { AccountInformationResolver, EndorsementResolver, EndorsementCoveragesResolver, PolicyInformationResolver, AdditionalNamedInsuredsResolver, EndorsementLocationResolver, UnderlyingCoveragesResolver, PolicyLayerResolver, InvoiceResolver } from './policy-resolver-service';
import { PolicyComponent } from './policy.component';
import { ReinsuranceComponent } from './reinsurance/reinsurance.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SummaryComponent } from './summary/summary.component';

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
      underlyingCoverages: UnderlyingCoveragesResolver
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

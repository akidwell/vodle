import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoveragesComponent } from './coverages/coverages.component';
import { InformationComponent } from './information/information.component';
import { PolicyNotFoundComponent } from './policy-not-found.component';
import { AccountInformationResolver, PolicyInformationResolver } from './policy-resolver-service';
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
      policyInfoData: PolicyInformationResolver
    },
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', component: InformationComponent },
      { path: 'coverages', component: CoveragesComponent },
      { path: 'schedules', component: SchedulesComponent },
      { path: 'reinsurance', component: ReinsuranceComponent },
      { path: 'summary', component: SummaryComponent }
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

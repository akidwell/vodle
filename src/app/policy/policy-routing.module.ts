import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoveragesComponent } from './coverages/coverages.component';
import { InformationComponent } from './information/information.component';
import { PolicyResolver } from './policy-resolver-service';
import { PolicyComponent } from './policy.component';
import { ReinsuranceComponent } from './reinsurance/reinsurance.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [{ path: '', component: PolicyComponent },
{
  path: ':id',
  component: PolicyComponent,
  resolve: { resolvedData: PolicyResolver },
  children: [
    { path: '', redirectTo: 'information', pathMatch: 'full' },
    { path: 'information', component: InformationComponent },
    { path: 'coverages', component: CoveragesComponent },
    { path: 'schedules', component: SchedulesComponent },
    { path: 'reinsurance', component: ReinsuranceComponent },
    { path: 'summary', component: SummaryComponent }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }

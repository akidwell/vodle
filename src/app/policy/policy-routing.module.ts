import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { PolicyResolver } from './policy-resolver-service';
import { PolicyComponent } from './policy.component';

const routes: Routes = [{ path: '', component: PolicyComponent },
{
  path: ':id',
  component: PolicyComponent,
  resolve: { resolvedData: PolicyResolver }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule { }

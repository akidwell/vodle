import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyNotFoundComponent } from '../policy/components/policy-not-found/policy-not-found.component';
import { PolicyV2Component } from './components/policy-v2/policy-v2.component';
import { PolicyResolver } from './services/policy-resolver/policy-resolver.service';

const routes: Routes = [
  {
    path: 'policy-not-found',
    component: PolicyNotFoundComponent,
  },
  {
    path: ':id/:end',
    component: PolicyV2Component,
    resolve: {
      policy: PolicyResolver,
    },
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      //   { path: 'information', component:PolicyInformationComponent },
    ],
  },
  {
    path: ':seq',
    component: PolicyV2Component,
    resolve: {
      policy: PolicyResolver,
    },
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
    //  { path: 'information', canDeactivate: [CanDeactivateGuard], component: PolicyInformationComponent }
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
export class PolicyV2RoutingModule { }

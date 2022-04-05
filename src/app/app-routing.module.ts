import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './applications/applications.component';
import { PageNotFoundComponent } from './page-not-found-component';
import { ReportsComponent } from './reports/reports.component';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { AuthGuard } from './authorization/auth.guard';
import { AccessDeniedComponent } from './access-denied.component';
import { OktaAuth } from '@okta/okta-auth-js';
const CALLBACK_PATH = 'callback';

export function onAuthRequired(_oktaAuth: OktaAuth) {
  _oktaAuth.signInWithRedirect({
    originalUri: '/home'
  });
}
const routes: Routes = [
  { path: CALLBACK_PATH, component: OktaCallbackComponent },
  {
    path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [OktaAuthGuard, AuthGuard], data: { onAuthRequired }
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'import', loadChildren: () => import('./import/import.module').then(m => m.ImportModule), canActivate: [OktaAuthGuard, AuthGuard], data: { onAuthRequired }
  },
  { path: 'reports', component: ReportsComponent },
  { path: 'applications', component: ApplicationsComponent },
  {
    path: 'policy', loadChildren: () => import('./policy/policy.module').then(m => m.PolicyModule), canActivate: [OktaAuthGuard, AuthGuard], data: { onAuthRequired }
  },
  {
    path: 'insured', loadChildren: () => import('./insured/insured.module').then(m => m.InsuredModule), canActivate: [OktaAuthGuard, AuthGuard], data: { onAuthRequired }
  },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'logged-out', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }

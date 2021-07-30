import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './applications/applications.component';
import { PageNotFoundComponent } from './page-not-found-component';
import { ReportsComponent } from './reports/reports.component';
import {OKTA_CONFIG, OktaAuthModule, OktaCallbackComponent, OktaAuthGuard} from '@okta/okta-angular';
const CALLBACK_PATH = 'callback/';


const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule), },
  { path: 'import', loadChildren: () => import('./import/import.module').then(m => m.ImportModule) },
  { path: 'policy', loadChildren: () => import('./policy/policy.module').then(m => m.PolicyModule) },
  { path: 'reports', component: ReportsComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: '**', component: PageNotFoundComponent },
   { path: CALLBACK_PATH, component: OktaCallbackComponent }
];

const config = {
  clientId: '0oa11jhvuyHgG4nJl1d7',
  issuer: 'https://logindev.gaig.com',
  Secret: 'p_U6WvtlClPwzm0KkMJunJN70qVklUUo5D-ebsrD',
  redirectUri: 'http://localhost:4200',
  scopes: ['openid', 'profile', 'email'],
  pkce: true
};

@NgModule({
  imports: [RouterModule.forRoot(routes),    
     OktaAuthModule,
  ],
  exports: [RouterModule],

  providers: [
    { provide: OKTA_CONFIG, useValue: config },
  ],
})
export class AppRoutingModule { }

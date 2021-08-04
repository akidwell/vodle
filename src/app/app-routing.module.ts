import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './applications/applications.component';
import { PageNotFoundComponent } from './page-not-found-component';
import { ReportsComponent } from './reports/reports.component';
import {OKTA_CONFIG, OktaAuthModule, OktaCallbackComponent, OktaAuthGuard} from '@okta/okta-angular';
const CALLBACK_PATH = 'callback';


const routes: Routes = [
  { path: CALLBACK_PATH, component: OktaCallbackComponent },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'import', loadChildren: () => import('./import/import.module').then(m => m.ImportModule) },
  { path: 'reports', component: ReportsComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: '**', component: PageNotFoundComponent },
];

const config = {
  clientId: '0oa13ty5ui2LT2Osn1d7',
  issuer: 'https://logindev.gaig.com',
  redirectUri: 'callback',
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

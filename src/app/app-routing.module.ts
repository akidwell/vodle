import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './applications/applications.component';
import { PageNotFoundComponent } from './page-not-found-component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule) },
  { path: 'import', loadChildren: () => import('./import/import.module').then(m => m.ImportModule) },
  { path: 'policy', loadChildren: () => import('./policy/policy.module').then(m => m.PolicyModule) },
  { path: 'reports', component: ReportsComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from './applications/applications.component';
import { PageNotFoundComponent } from './page-not-found-component';
import { ReportsComponent } from './reports/reports.component';
import { OktaCallbackComponent} from '@okta/okta-angular';
import { AuthGuard } from './authorization/auth.guard';
const CALLBACK_PATH = 'callback';


const routes: Routes = [
  { path: CALLBACK_PATH, component: OktaCallbackComponent },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'import', loadChildren: () => import('./import/import.module').then(m => m.ImportModule), canActivate: [ AuthGuard ]  },
  { path: 'reports', component: ReportsComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: '**', component: PageNotFoundComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }

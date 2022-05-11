import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsuredComponent } from './components/insured-base/insured.component';
import { InsuredInformationComponent } from './components/insured-information/insured-information.component';
import { InsuredNotFoundComponent } from './components/insured-not-found/insured-not-found.component';
import { InsuredSubmissionActivityComponent } from './components/insured-submission-activity/insured-submission-activity.component';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { InsuredResolver } from './services/insured-resolver/insured-resolver.service';

const routes: Routes = [
  {
    path: 'insured-not-found',
    component: InsuredNotFoundComponent
  },
  {
    path: '',
    component: InsuredComponent,
    resolve: {
      insuredData: InsuredResolver
    },
    children: [
      { path: '', redirectTo: 'information',pathMatch: 'full' },
      { path: 'information', component: InsuredInformationComponent, canDeactivate: [CanDeactivateGuard] , data: { saveComponent: true } },
      { path: 'submissions', component: InsuredSubmissionActivityComponent, canDeactivate: [CanDeactivateGuard] , data: { saveComponent: true } },
    ]
  },
  {
    path: ':id',
    component: InsuredComponent,
    resolve: {
      insuredData: InsuredResolver
    },
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', component: InsuredInformationComponent, canDeactivate: [CanDeactivateGuard] , data: { saveComponent: true } },
      { path: 'submissions', component: InsuredSubmissionActivityComponent, canDeactivate: [CanDeactivateGuard] , data: { saveComponent: true, bypassFormGuard: true } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuredRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { InsuredInformationComponent } from './components/insured-information/insured-information.component';
import { SubmissionNotFoundComponent } from './components/submission-not-found/submission-not-found.component';
// import { InsuredSubmissionActivityComponent } from './components/insured-submission-activity/insured-submission-activity.component';
// import { CanDeactivateGuard } from './guards/can-deactivate-guard';
// import { InsuredResolver } from './services/insured-resolver/insured-resolver.service';
import { SubmissionComponent } from './components/submission-base/submission.component';
import { SubmissionResolver } from './services/submisson-resolver/submission-resolver.service';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { SubmissionInfoBaseComponent } from './components/submission-info-base/submission-info-base.component';

const routes: Routes = [
  {
    path: 'submission-not-found',
    component: SubmissionNotFoundComponent
  },
  {
    path: '',
    component: SubmissionComponent,
    resolve: {
      submissionData: SubmissionResolver
    },
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', component: SubmissionInfoBaseComponent, canDeactivate: [CanDeactivateGuard] , data: { saveComponent: true } }
    ]
  },
  {
    path: ':id',
    component: SubmissionComponent,
    resolve: {
      submissionData: SubmissionResolver
    },
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', component: SubmissionInfoBaseComponent, canDeactivate: [CanDeactivateGuard] , data: { saveComponent: true } },
      // { path: 'submissions', component: InsuredSubmissionActivityComponent, canDeactivate: [CanDeactivateGuard] , data: { saveComponent: true } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmissionRoutingModule { }

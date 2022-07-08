import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { InsuredInformationComponent } from './components/insured-information/insured-information.component';
import { SubmissionNotFoundComponent } from './components/submission-not-found/submission-not-found.component';
// import { InsuredSubmissionActivityComponent } from './components/insured-submission-activity/insured-submission-activity.component';
// import { CanDeactivateGuard } from './guards/can-deactivate-guard';
// import { InsuredResolver } from './services/insured-resolver/insured-resolver.service';
import { SubmissionComponent } from './components/submission-base/submission.component';
import { SubmissionResolver } from './services/submisson-resolver/submission-resolver.service';
import { SubmissionInformationComponent } from './components/submission-information/submission-information.component';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';

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
      { path: 'information', component: SubmissionInformationComponent, canDeactivate: [CanDeactivateGuard] , data: { saveComponent: true } }
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
      { path: 'information', component: SubmissionInformationComponent, canDeactivate: [CanDeactivateGuard] , data: { saveComponent: true } },
      // { path: 'submissions', component: InsuredSubmissionActivityComponent, canDeactivate: [CanDeactivateGuard] , data: { saveComponent: true } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmissionRoutingModule { }

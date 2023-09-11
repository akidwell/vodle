import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NavigationConfirmationService } from '../../../core/services/navigation-confirmation/navigation-confirmation.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { SubmissionStatusEnum } from 'src/app/core/enums/submission-status-enum';
import { SubmissionInfoBaseComponent } from '../components/submission-info-base/submission-info-base.component';

@Injectable()
export class CanDeactivateGuard  {
  constructor(
    private router: Router,
    private navigationConfirmationService: NavigationConfirmationService,
    private pageDataService: PageDataService
  ) {}

  canDeactivate(
    component: SubmissionInfoBaseComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean> | boolean | Promise<boolean> {
    if (component instanceof SubmissionInfoBaseComponent) {
      // Skip checks if bypassFormGuard is set
      if (this.router.getCurrentNavigation()?.extras?.state?.bypassFormGuard) {
        return true;
      }
      const submission = this.pageDataService.submissionData || null;
      if (submission != null) {
        if (submission && submission.isValid) {
          if (submission.isDirty) {
            if (this.checkLeaveSubmission(state.url, nextState.url)) {
              return this.confirmLeave().then((confirm) => {
                if (confirm) {
                  submission.hideErrorMessage();
                }
                return confirm;
              });
            }
          }
          // No error and no longer dirty then hide any errors and navigate to next route
          submission.hideErrorMessage();
          return true;
          //submission will never be valid when a submission is marked DEAD
        } else if (submission && submission.statusCode == SubmissionStatusEnum.Dead) {
          return true;
        }
        // Show errors
        submission.showErrorMessage();
        window.scroll(0, 0);
        // Check to see if trying to leave policy
        if (this.checkLeaveSubmission(state.url, nextState.url)) {
          return this.confirmLeave().then((confirm) => {
            if (confirm) {
              submission.hideErrorMessage();
            }
            return confirm;
          });
        }
      }
      return false;
    }
    return true;
  }

  checkLeaveSubmission(startUrl: string, endUrl: string): boolean {
    const startRoute = startUrl.split('/');
    const endRoute = endUrl.split('/');
    // if nagivating outstide policy then open confirm leave dialog
    if (!endUrl.startsWith('/Submission') || endUrl.endsWith('/submissions')) {
      return true;
    }
    // if nagivating different policy or endorsement then open confirm leave dialog
    else if (startRoute[1] != endRoute[1] || startRoute[2] != endRoute[2]) {
      return true;
    }
    return false;
  }

  async confirmLeave(): Promise<boolean> {
    const option = await this.navigationConfirmationService.open(
      'Leave Confirmation',
      'Do you want to leave without saving?'
    );
    if (option) {
      this.pageDataService.submissionData?.resetClass();
      this.pageDataService.submissionData?.markClean();
    }
    return option;
  }
}

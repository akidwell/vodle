import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HistoryService } from 'src/app/core/services/policy-history/policy-history.service';
import { SubmissionClass } from '../../classes/submission-class';
import { SubmissionResolved } from '../../models/submission-resolved';
import { SubmissionService } from '../submission-service/submission-service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionResolver  {

  constructor(private router: Router, private submissionService: SubmissionService, private historyService: HistoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<SubmissionResolved> {
    const id = route.paramMap.get('id') ?? '';
    if (id == '') {
      const insured = this.router.getCurrentNavigation()?.extras?.state?.insured || null;
      if (insured == null) {
        const message = 'No insured found.';
        this.router.navigate(['/submission/submission-not-found'], { state: { error: message } });
      }
      return of({ submission: new SubmissionClass(undefined, insured) });
    }

    // Extract submission from routing if possible - This  might not be needed anymore keeping for reference only for now
    // const submission = this.router.getCurrentNavigation()?.extras?.state?.submission;
    // if (submission != null){
    //   return of({ submission: submission});
    // }

    if (isNaN(+id)) {
      const message = 'Submission number was not a number: ${id}';
      this.router.navigate(['/submission/submission-not-found'], { state: { error: message } });
      return of({ submission: null, error: message });
    }

    return this.submissionService.getSubmission(Number(id))
      .pipe(
        tap((submission) => {
          // Update history for opened Submission
          this.historyService.updateSubmissionHistory(submission.submissionNumber);
        }),
        map(submission => ({ submission })),
        catchError((error) => {
          this.router.navigate(['/submission/submission-not-found'], { state: { error: error.message } });
          return of({ submission: null, error: error });
        })
      );
  }
}

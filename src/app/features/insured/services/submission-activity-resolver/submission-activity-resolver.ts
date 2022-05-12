import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { SubmissionActivityResolved } from '../../models/submission-activity-resolved';
import { SubmissionActivityService } from '../submission-activity-service/submission-activity.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionActivityResolver implements Resolve<SubmissionActivityResolved> {

  constructor(private router: Router, private submissionActivityService: SubmissionActivityService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<SubmissionActivityResolved> {
    const id = route.paramMap.get('id') ?? '';

    if (isNaN(+id)) {
      const message = `Insured id was not a number: ${id}`;
      this.router.navigate(['/insured/insured-not-found'], { state: { error: message } });
      return of({ submissionSearchResponse: null, error: message });
    }

    return this.submissionActivityService.getSubmissionActivityByInsuredCode(Number(id))
      .pipe(
        map(submissionSearchResponse => ({ submissionSearchResponse })),
        catchError((error) => {
          this.router.navigate(['/insured/insured-not-found'], { state: { error: error.message } });
          return of({ submissionSearchResponse: null, error: error });
        })
      );
  }
}
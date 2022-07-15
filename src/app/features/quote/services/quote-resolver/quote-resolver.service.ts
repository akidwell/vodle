import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { HistoryService } from 'src/app/core/services/policy-history/policy-history.service';
import { SubmissionClass } from 'src/app/features/submission/classes/SubmissionClass';
import { QuoteResolved } from '../../models/quote-resolved';
import { QuoteService } from '../quote-service/quote.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteResolver implements Resolve<QuoteResolved> {

  constructor(private router: Router, private quoteService: QuoteService, private historyService: HistoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QuoteResolved> {
    const sequenceNumber = route.paramMap.get('seq') ?? '';
    const submission: SubmissionClass = this.router.getCurrentNavigation()?.extras?.state?.submission;
    console.log(state, submission);
    if (sequenceNumber == '' && submission.departmentCode != null){
      return this.quoteService.getQuotes(undefined, submission.departmentCode)
        .pipe(
          tap((department) => {
            console.log(department);
            department.submissionForQuote = submission;
          // Update history for opened Quote
          //this.historyService.updateQuoteHistory(Number(sequenceNumber), quote[0].submissionNumber);
          }),
          map(department => ({ department })),
          catchError((error) => {
            this.router.navigate(['/quote/quote-not-found'], { state: { error: error.message } });
            return of({ department: null, error: error });
          })
        );
    }
    if (sequenceNumber == '') {
      return of({ department: null});
    }
    if (isNaN(+sequenceNumber)) {
      const message = `SequenceNumber  was not a number: ${sequenceNumber}`;
      this.router.navigate(['/quote/quote-not-found'], { state: { error: message } });
      return of({ department: null, error: message });
    }

    return this.quoteService.getQuotes(Number(sequenceNumber))
      .pipe(
        tap((department) => {
          console.log(department);
          // Update history for opened Quote
          //this.historyService.updateQuoteHistory(Number(sequenceNumber), quote[0].submissionNumber);
        }),
        map(department => ({ department })),
        catchError((error) => {
          this.router.navigate(['/quote/quote-not-found'], { state: { error: error.message } });
          return of({ department: null, error: error });
        })
      );
  }
}


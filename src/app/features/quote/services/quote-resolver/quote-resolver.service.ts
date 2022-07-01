import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, catchError, of, tap } from 'rxjs';
import { HistoryService } from 'src/app/core/services/policy-history/policy-history.service';
import { QuoteClass } from '../../classes/quote-class';
import { QuoteResolved } from '../../models/quote-resolved';
import { QuoteService } from '../quote-service/quote.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteResolver implements Resolve<QuoteResolved> {

  constructor(private router: Router, private quoteService: QuoteService, private historyService: HistoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QuoteResolved> {
    const sequenceNumber = route.paramMap.get('seq') ?? '';
    if (sequenceNumber == '') {
      return of({ quote: null});
    }
    if (isNaN(+sequenceNumber)) {
      const message = `SequenceNumber  was not a number: ${sequenceNumber}`;
      this.router.navigate(['/quote/quote-not-found'], { state: { error: message } });
      return of({ quote: null, error: message });
    }

    return this.quoteService.getQuotes(Number(sequenceNumber))
      .pipe(
        // Comment until we decode on routing
        // tap((quote) => {
        //   // Update history for opened Quote
        //   this.historyService.updateQuoteHistory(quote.submissionNumber ?? 0, quote.quoteNumber ?? 0);
        // }),
        map(quote => ({ quote })),
        catchError((error) => {
          this.router.navigate(['/quote/quote-not-found'], { state: { error: error.message } });
          return of({ quote: null, error: error });
        })
      );
  }
}
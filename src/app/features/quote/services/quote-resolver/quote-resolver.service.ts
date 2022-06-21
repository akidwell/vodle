import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { QuoteClass } from '../../classes/quote-class';
import { QuoteResolved } from '../../models/quote-resolved';
import { QuoteService } from '../quote-service/quote.service';

@Injectable({
  providedIn: 'root'
})
export class QuoteResolver implements Resolve<QuoteResolved> {

  constructor(private router: Router, private quoteService: QuoteService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QuoteResolved> {
    const subNumber = route.paramMap.get('id') ?? '';
    if (subNumber == '') {
      return of({ quote: new QuoteClass()});
    }
    if (isNaN(+subNumber)) {
      const message = `SubmissionNumber  was not a number: ${subNumber}`;
      this.router.navigate(['/quote/quote-not-found'], { state: { error: message } });
      return of({ quote: null, error: message });
    }

    return this.quoteService.getQuote(Number(subNumber))
      .pipe(
        map(quote => ({ quote })),
        catchError((error) => {
          this.router.navigate(['/quote/quote-not-found'], { state: { error: error.message } });
          return of({ quote: null, error: error });
        })
      );
  }
}
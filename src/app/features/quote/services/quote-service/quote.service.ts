import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { QuoteClass } from '../../classes/quote-class';
import { Quote } from '../../models/quote';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getQuotes(sequenceNumber: number): Observable<QuoteClass[]> {
    return this.http.get<Quote[]>(this.config.apiBaseUrl + 'api/quotes/' + sequenceNumber)
      .pipe(
        map((receivedData: Quote[]) => {
          const data: QuoteClass[] = [];
          receivedData.forEach( x => {
            data.push(new QuoteClass(x));
          });
          return data;
        }));
  }
}

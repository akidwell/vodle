import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { Quote } from 'src/app/features/quote/models/quote';

@Injectable({
  providedIn: 'root'
})
export class SpecimenPacketService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getSpecialNote(formName: string): Observable<string> {
    const params = new HttpParams().append('formName', formName ?? '');
    return this.http.get<string>(this.config.apiBaseUrl + 'api/lookups/special-notes', { params, responseType: 'text' as 'json'});
  }

  getSpecimenURL(formName: string): Observable<string> {
    const params = new HttpParams().append('formName', formName ?? '');
    return this.http.get<string>(this.config.apiBaseUrl + 'api/lookups/specimens', { params, responseType: 'text' as 'json'});
  }

  getSpecimentPacketURL(quoteKey: string, forms: string): Observable<string> {
    const params = new HttpParams().append('quoteKey', quoteKey ?? '').append('forms', forms ?? '');
    return this.http.get<string>(this.config.apiBaseUrl + 'api/lookups/specimen-packets', { params, responseType: 'text' as 'json'});
  }

  getGuideline(formName: string) {
    const params = new HttpParams().append('formName', formName);
    const headers = { 'Content-Type': 'application/pdf'};
    return this.http.get(this.config.apiBaseUrl + 'api/lookups/guidelines', { params: params, headers, responseType: 'arraybuffer'});
  }

  refreshForms(quote: QuoteClass) {
    const quoteJSON = quote.toJSON();
    const headers = { 'Content-Type': 'application/json'};
    return this.http.post<Quote>(this.config.apiBaseUrl + 'api/quotes/refresh-forms', quoteJSON, {headers});
  }
}
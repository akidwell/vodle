import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuotePolicyFormClass } from 'src/app/features/quote/classes/quote-policy-forms-class';
import { Quote } from 'src/app/features/quote/models/quote';
import { PolicyForm } from 'src/app/shared/interfaces/policy-form';

@Injectable({
  providedIn: 'root'
})
export class SpecimenPacketService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getSpecialNote(formName: string): Observable<string> {
    const params = new HttpParams().append('formName', formName ?? '');
    return this.http.get<string>(this.config.apiBaseUrl + 'api/forms/special-notes', { params, responseType: 'text' as 'json'});
  }

  getSpecimenURL(formName: string): Observable<string> {
    const params = new HttpParams().append('formName', formName ?? '');
    return this.http.get<string>(this.config.apiBaseUrl + 'api/forms/specimens', { params, responseType: 'text' as 'json'});
  }

  getSpecimentPacketURL(quoteKey: string, forms: string): Observable<string> {
    const params = new HttpParams().append('quoteKey', quoteKey ?? '').append('forms', forms ?? '');
    return this.http.get<string>(this.config.apiBaseUrl + 'api/forms/specimen-packets', { params, responseType: 'text' as 'json'});
  }

  getGuideline(formName: string) {
    const params = new HttpParams().append('formName', formName);
    const headers = { 'Content-Type': 'application/pdf'};
    return this.http.get(this.config.apiBaseUrl + 'api/forms/guidelines', { params: params, headers, responseType: 'arraybuffer'});
  }

  searchForms(searchValue: string): Observable<QuotePolicyFormClass[]> {
    const params = new HttpParams().append('searchValue', searchValue ?? '');
    return this.http.get<PolicyForm[]>(this.config.apiBaseUrl + 'api/forms/forms-search', { params}).pipe(
      map(response => {
        const data: QuotePolicyFormClass[] = [];
        response.forEach(element => {
          data.push(new QuotePolicyFormClass(element));
        });
        return data;
      })
    );
  }

}
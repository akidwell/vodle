import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { QuotePolicyFormClass } from 'src/app/features/quote/classes/quote-policy-forms-class';
import { Quote } from 'src/app/features/quote/models/quote';
import { PolicyForm } from 'src/app/shared/interfaces/policy-form';
import { VariableFormData } from 'src/app/shared/interfaces/variable-form-data';
import { VariableForm } from './variable-form';
import { VariableFormRequest } from './variable-form-request';

@Injectable({
  providedIn: 'root'
})
export class PolicyFormsService {

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

  hasGuideline(formName: string): Observable<boolean> {
    const params = new HttpParams().append('formName', formName);
    return this.http.get<boolean>(this.config.apiBaseUrl + 'api/forms/guidelines', { params: params});
  }

  getGuideline(formName: string) {
    const params = new HttpParams().append('formName', formName);
    const headers = { 'Content-Type': 'application/pdf'};
    return this.http.get(this.config.apiBaseUrl + 'api/forms/guidelines-pdf', { params: params, headers, responseType: 'arraybuffer'});
  }

  getVariableFormattedValue(value: string, format: string, columnType: string): Observable<string> {
    const params = new HttpParams().append('value', value).append('format', format).append('columnType', columnType);
    return this.http.get<string>(this.config.apiBaseUrl + 'api/forms/variable-field-format', { params: params, responseType: 'text' as 'json'});
  }

  getVariableFormData(form: VariableFormRequest): Observable<VariableFormData[]> {
    return this.http.post<VariableFormData[]>(this.config.apiBaseUrl + 'api/forms/variable-form-data', form);
  }

  getVariable(form: VariableFormRequest) {
    const headers = { 'Content-Type': 'application/json'};
    return this.http.post(this.config.apiBaseUrl + 'api/forms/variable-form', form, { headers, responseType: 'arraybuffer'});
  }

  getQuote(quoteId: number) {
    const params = new HttpParams().append('quoteId', quoteId);
    const headers = { 'Content-Type': 'application/octet-stream'};
    return this.http.get(this.config.apiBaseUrl + 'api/forms/quote-letter', { params, headers, responseType: 'arraybuffer'});
    // return this.http.get(this.config.apiBaseUrl + 'api/forms/quote-letter', { params, headers, responseType: 'arraybuffer', observe: 'response'});
    //  .subscribe((c: any) => {
    //   console.log(c.headers.get('content-disposition'));
    // }
    //   );
      // .pipe(map((res: any) => {
      //   console.log(res.headers.get('content-disposition'));
      //   return res;
      // }));
  }

  getBinder(quoteId: number) {
    const params = new HttpParams().append('quoteId', quoteId);
    const headers = { 'Content-Type': 'application/pdf'};
    return this.http.get(this.config.apiBaseUrl + 'api/forms/quote-binder', { params, headers, responseType: 'arraybuffer'});
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
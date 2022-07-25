import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { MortgageeClass } from 'src/app/shared/components/propertry-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { DepartmentClass } from '../../classes/department-class';
import { QuoteClass } from '../../classes/quote-class';
import { Department } from '../../models/department';
import { Quote } from '../../models/quote';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getQuotes(sequenceNumber?: number, departmentCode?: number): Observable<DepartmentClass> {
    if (sequenceNumber) {
      return this.http.get<Department>(this.config.apiBaseUrl + 'api/quotes/full/' + sequenceNumber)
        .pipe(
          map((receivedData: Department) => {
            return new DepartmentClass(receivedData);
          }));
    } else {
      return this.http.get<Department>(this.config.apiBaseUrl + 'api/quotes/new/' + departmentCode)
        .pipe(
          map((receivedData: Department) => {
            return new DepartmentClass(receivedData);
          }));
    }
  }
  postQuote(quote: QuoteClass) {
    const quoteJSON = quote.toJSON();
    const headers = { 'Content-Type': 'application/json'};
    return this.http.post<number>(this.config.apiBaseUrl + 'api/quotes/', quoteJSON, {headers});
  }

  deleteDeductible(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'quotes/property-deductibles/' + id);
  }

  deleteMortgagee(mortgagee: MortgageeClass): Observable<boolean> {
    console.log(mortgagee);
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/mortgagee/' + mortgagee.propertyQuoteMortgageeId?.toString());
  }
  deleteAdditionalInterest(ai: AdditionalInterestClass): Observable<boolean> {
    console.log(ai);
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/mortgagee/' + ai.propertyQuoteAdditionalInterestId?.toString());
  }

  import(sequenceNumber: number, file: any) {
    //const quoteJSON = quote.toJSON();
    //const headers = { 'Content-Type': 'application/json'};

    const params = new HttpParams().append('sequenceNumber', sequenceNumber);
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Quote>(this.config.apiBaseUrl + 'api/quotes/import', formData, { params });
  }

}

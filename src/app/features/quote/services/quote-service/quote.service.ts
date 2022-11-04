import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { QuoteData } from 'src/app/features/policy/models/policy';
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
  updateAllQuotes(department: DepartmentClass) {
    const departmentJSON = department.toJSON();
    console.log(departmentJSON);
    const headers = { 'Content-Type': 'application/json'};
    return this.http.put<DepartmentClass>(this.config.apiBaseUrl + 'api/quotes/full', departmentJSON, {headers});
  }
  updateQuote(quote: QuoteClass) {
    const quoteJSON = quote.toJSON();
    console.log(quoteJSON);
    const headers = { 'Content-Type': 'application/json'};
    return this.http.put<Quote>(this.config.apiBaseUrl + 'api/quotes/', quoteJSON, {headers});
  }
  deleteDeductible(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/property-deductibles/' + id);
  }
  deleteOptionalCoverage(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/optional-coverage/' + id);
  }
  deleteAllBuildings(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/property-quote/' + id + '/property-buildings');
  }
  deleteBuilding(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/property-buildings/' + id);
  }
  deleteCoverage(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/property-buildings/coverages/' + id);
  }
  deleteMortgagee(mortgagee: MortgageeClass): Observable<boolean> {
    console.log(mortgagee);
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/mortgagee/' + mortgagee.propertyQuoteMortgageeId?.toString());
  }
  deleteAdditionalInterest(ai: AdditionalInterestClass): Observable<boolean> {
    console.log(ai);
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/additional-interest/' + ai.propertyQuoteAdditionalInterestId?.toString());
  }
  deleteLineItem(id: number, sequence: number): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/quote-line-item/' + id + '/seq/' + sequence);
  }
  deleteLineItems(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/quote-line-item/' + id);
  }
  deleteGeneralRemark(quoteId: number, remarkId: number): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/quotes/general-remarks/' + quoteId + '/remark/' + remarkId);
  }

  import(quote: Quote, file: any) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(quote));
    formData.append('file', file);
    return this.http.post<Quote>(this.config.apiBaseUrl + 'api/quotes/import', formData);
  }

}

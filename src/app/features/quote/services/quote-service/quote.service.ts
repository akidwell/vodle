import { HttpClient } from '@angular/common/http';
import { Quote } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { MortgageeClass } from 'src/app/shared/components/propertry-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { DepartmentClass } from '../../classes/department-class';
import { QuoteClass } from '../../classes/quote-class';
import { Department } from '../../models/department';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getQuotes(sequenceNumber?: number, departmentCode?: number): Observable<DepartmentClass> {
    const propertyQuoteMortgagee: MortgageeClass[] = [];
    const propertyQuoteAdditionalInterest: AdditionalInterestClass[] = [];
    if (sequenceNumber) {
      return this.http.get<Department>(this.config.apiBaseUrl + 'api/quotes/full/' + sequenceNumber)
        .pipe(
          map((receivedData: Department) => {
            receivedData?.programMappings[0]?.quoteData?.propertyQuoteMortgagee?.forEach(x => {
              propertyQuoteMortgagee.push(new MortgageeClass(x));
            });
            receivedData?.programMappings[0]?.quoteData?.propertyQuoteAdditionalInterest?.forEach(x => {
              propertyQuoteAdditionalInterest.push(new AdditionalInterestClass(x));
            });
            if(receivedData?.programMappings[0]?.quoteData?.propertyQuoteAdditionalInterest){
              receivedData.programMappings[0].quoteData.propertyQuoteAdditionalInterest = propertyQuoteAdditionalInterest;
            }
            if(receivedData?.programMappings[0]?.quoteData?.propertyQuoteMortgagee){
              receivedData.programMappings[0].quoteData.propertyQuoteMortgagee = propertyQuoteMortgagee;
            }
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
    return this.http.post<Quote>(this.config.apiBaseUrl + 'api/quotes/', quoteJSON, {headers});
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
}

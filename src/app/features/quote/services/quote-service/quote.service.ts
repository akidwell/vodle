import { HttpClient } from '@angular/common/http';
import { Quote } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { DepartmentClass } from '../../classes/department-class';
import { QuoteClass } from '../../classes/quote-class';
import { Department } from '../../models/department';

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
    return this.http.put<number>(this.config.apiBaseUrl + 'api/quotes/full', departmentJSON, {headers});
  }
  updateQuote(quote: QuoteClass) {
    const quoteJSON = quote.toJSON();
    console.log(quoteJSON);
    const headers = { 'Content-Type': 'application/json'};
    return this.http.put<number>(this.config.apiBaseUrl + 'api/quotes/', quoteJSON, {headers});
  }
}

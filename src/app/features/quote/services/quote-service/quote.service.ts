import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { DepartmentClass } from '../../classes/department-class';
import { Department } from '../../models/department';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getQuotes(sequenceNumber: number): Observable<DepartmentClass> {
    return this.http.get<Department>(this.config.apiBaseUrl + 'api/quotes/full/' + sequenceNumber)
      .pipe(
        map((receivedData: Department) => {
          return new DepartmentClass(receivedData);
        }));
  }
}

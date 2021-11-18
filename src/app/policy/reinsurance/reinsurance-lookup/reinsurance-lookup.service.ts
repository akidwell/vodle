import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from 'src/app/config/config.service';
import { ReinsuranceLookup } from './reinsurance-lookup';

@Injectable({
  providedIn: 'root'
})
export class ReinsuranceLookupService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getReinsurance(programId: number,effectiveDate: Date): Observable<ReinsuranceLookup[]> {
    const params = new HttpParams().append('programId', programId).append('effectiveDate', effectiveDate.toString());;
    return this.http.get<ReinsuranceLookup[]>(this.config.apiBaseUrl + 'api/reinsurance-lookup', { params })
      // .pipe(
      //   catchError(() => {
      //     return of(null);
      //   }))
      ;
  }

  getFaculativeReinsurance(effectiveDate: Date): Observable<ReinsuranceLookup[]> {
    const params = new HttpParams().append('effectiveDate', effectiveDate.toString());;
    return this.http.get<ReinsuranceLookup[]>(this.config.apiBaseUrl + 'api/reinsurance-lookup/faculative', { params })
      // .pipe(
      //   catchError(() => {
      //     return of(null);
      //   }))
      ;
  }
}

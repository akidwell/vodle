import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { Code } from './code';

@Injectable({
  providedIn: 'root'
})
export class DropDownsService {
  private readonly refreshSubject = new Subject();
  
  constructor(private http: HttpClient, private config: ConfigService) { }

  getPACCodes(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/pac-codes');
  }
  
  getCoverageCodes(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/coverage-codes');
  }

  getStates(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/states');
  }

  getCarrierCodes(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/carrier-codes');
  }

  getRiskGrades(programId: number): Observable<Code[]> {
    const params = new HttpParams().append('programId', programId);
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/risk-grades', {params})
  }

  getAuditCodes(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/audit-codes')
  }

  getAssumedCarriers(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/assumed-carriers')
  }

  getNYFreeTradeZones(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/ny-free-trade-zones')
  }

  getDeregulationIndicators(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/deregulation-indicators')
  }

  getPaymentFrequencies(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/payment-frequencies')
  }

  getRiskTypes(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/risk-types')
  }

}

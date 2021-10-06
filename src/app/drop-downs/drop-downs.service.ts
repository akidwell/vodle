import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { finalize, share, tap } from 'rxjs/operators';
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

  getCoverageDescriptions(coverageCode: string, classCode: number, policySymbol: string,programId: number, coverageId?: number | null): Observable<Code[]> {
    let params = new HttpParams().append('coverageCode', coverageCode).append('classCode', classCode ?? "").append('policySymbol', policySymbol).append('programId', programId);
    if (coverageId != null)
    {
      params = params.append('coverageId',coverageId);
    }
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/coverage-descriptions', { params })
  }

  getIncludeExcludes(programId: number, coverageDescriptionId: number): Observable<Code[]> {
    console.log("include");
    const params = new HttpParams().append('programId', programId).append('coverageDescriptionId', coverageDescriptionId);
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/include-excludes', { params })
  }


  private cacheClassCodese: any;
  private cacheClassCodese$!: Observable<any> | null;

  getClassCodes(programId: number, coverageCode: string): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheClassCodese) {
      observable = of(this.cacheClassCodese);
    } else if (this.cacheClassCodese$) {
      observable = this.cacheClassCodese$;
    } else {
      console.log("codetable/deducttype");
      let params = new HttpParams().append('programId', programId).append('coverageCode', coverageCode);
      this.cacheClassCodese$ = this.http.get<Code[]>(this.config.apiBaseUrl + 'api/class-codes', { params })
        .pipe(
          tap(res => this.cacheClassCodese = res),
          share(),
          finalize(() => this.cacheClassCodese$ = null)
        );
      observable = this.cacheClassCodese$;
    }
    return observable;
  }

  // getClassCodes(coverageCode: string): Observable<Code[]> {
  //   const params = new HttpParams().append('coverageCode', coverageCode);
  //   return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/class-codes', { params })
  // }

  getTransactionTypes(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/transaction-types')
  }

  getTerrorismCodes(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/codetable/terrorism_code')
  }


  private cacheActions: any;
  private cacheActions$!: Observable<any> | null;

  getActionCodes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheActions) {
      observable = of(this.cacheActions);
    } else if (this.cacheActions$) {
      observable = this.cacheActions$;
    } else {
      console.log("action");
      this.cacheActions$ = this.http.get<Code[]>(this.config.apiBaseUrl + 'api/codetable/coverage_action')
        .pipe(
          tap(res => this.cacheActions = res),
          share(),
          finalize(() => this.cacheActions$ = null)
        );
      observable = this.cacheActions$;
    }
    return observable;
  }

  // getActionCodes(): Observable<Code[]> {
  //   return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/codetable/coverage_action')
  // }


  private cacheClaimsMade: any;
  private cacheClaimsMade$!: Observable<any> | null;

  getClaimsMadeCodes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheClaimsMade) {
      observable = of(this.cacheClaimsMade);
    } else if (this.cacheClaimsMade$) {
      observable = this.cacheClaimsMade$;
    } else {
      console.log("claimsmade");
      this.cacheClaimsMade$ = this.http.get<Code[]>(this.config.apiBaseUrl + 'api/codetable/claimsmade')
        .pipe(
          tap(res => this.cacheClaimsMade = res),
          share(),
          finalize(() => this.cacheClaimsMade$ = null)
        );
      observable = this.cacheClaimsMade$;
    }
    return observable;
  }

  // getClaimsMadeCodes(): Observable<Code[]> {
  //   console.log("claimsmade");
  //   return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/codetable/claimsmade');
  // }

  private cacheDeductibleType: any;
  private cacheDeductibleType$!: Observable<any> | null;

  getDeductibleTypes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheDeductibleType) {
      observable = of(this.cacheDeductibleType);
    } else if (this.cacheDeductibleType$) {
      observable = this.cacheDeductibleType$;
    } else {
      console.log("codetable/deducttype");
      this.cacheDeductibleType$ = this.http.get<Code[]>(this.config.apiBaseUrl + 'api/codetable/deducttype')
        .pipe(
          tap(res => this.cacheDeductibleType = res),
          share(),
          finalize(() => this.cacheDeductibleType$ = null)
        );
      observable = this.cacheDeductibleType$;
    }
    return observable;
  }

  // getDeductibleTypes(): Observable<Code[]> {
  //   return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/codetable/deducttype')
  // }

  private cacheExposureCodes: any;
  private cacheExposureCodes$!: Observable<any> | null;

  getExposureCodes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheExposureCodes) {
      observable = of(this.cacheExposureCodes);
    } else if (this.cacheExposureCodes$) {
      observable = this.cacheExposureCodes$;
    } else {
      console.log("exposure-codes");
      this.cacheExposureCodes$ = this.http.get<Code[]>(this.config.apiBaseUrl + 'api/exposure-codes')
        .pipe(
          tap(res => this.cacheExposureCodes = res),
          share(),
          finalize(() => this.cacheExposureCodes$ = null)
        );
      observable = this.cacheExposureCodes$;
    }
    return observable;
  }

  // getExposureCodes(): Observable<Code[]> {
  //   console.log("exposure-codes");
  //   return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/exposure-codes')
  // }

  private cachePremTypes: any;
  private cachePremTypes$!: Observable<any> | null;

  getPremTypes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cachePremTypes) {
      observable = of(this.cachePremTypes);
    } else if (this.cachePremTypes$) {
      observable = this.cachePremTypes$;
    } else {
      console.log("premtype");
      this.cachePremTypes$ = this.http.get<Code[]>(this.config.apiBaseUrl + 'api/codetable/premtype')
        .pipe(
          tap(res => this.cachePremTypes = res),
          share(),
          finalize(() => this.cachePremTypes$ = null)
        );
      observable = this.cachePremTypes$;
    }
    return observable;
  }

  // getPremTypeCodes(): Observable<Code[]> {
  //   return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/codetable/premtype')
  // }


}

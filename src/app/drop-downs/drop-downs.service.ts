import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { finalize, share, tap } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { UnderlyingLimitBasis } from '../policy/schedules/schedules';
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

  private cacheCoverageCodes: any;
  private cacheCoverageCodes$!: Observable<any> | null;

  getCoverageCodes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheCoverageCodes) {
      observable = of(this.cacheCoverageCodes);
    } else if (this.cacheCoverageCodes$) {
      observable = this.cacheCoverageCodes$;
    } else {
      this.cacheCoverageCodes$ = this.http.get<Code[]>(this.config.apiBaseUrl + 'api/coverage-codes')
        .pipe(
          tap(res => this.cacheCoverageCodes = res),
          share(),
          finalize(() => this.cacheCoverageCodes$ = null)
        );
      observable = this.cacheCoverageCodes$;
    }
    return observable;
  }

  getStates(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/states');
  }
  getLimitsPatterns(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/limits-patterns');
  }
  getLimitsBasis(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/limits-basis');
  }
  getCarrierCodes(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/carrier-codes');
  }

  getRiskGrades(programId?: number): Observable<Code[]> {
    if (programId) {
      const params = new HttpParams().append('programId', programId);
      return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/risk-grades', { params })
    }
    else {
      return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/risk-grades')
    }
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
  clearPolicyDropDowns() {
    this.clearClassCodes();
  }

  getCoverageDescriptions(coverageCode: string, policySymbol: string, programId: number, classCode?: number | null, coverageId?: number | null): Observable<Code[]> {
    let params = new HttpParams().append('coverageCode', coverageCode).append('classCode', classCode ?? "").append('policySymbol', policySymbol).append('programId', programId);
    if (coverageId != null) {
      params = params.append('coverageId', coverageId);
    }
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/coverage-descriptions', { params })
  }

  getUnderlyingCoverageDescriptions(){
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/underlying-coverage-descriptions');
  }
  getLimitBasisDescriptions(coverageCode: number,programId: number, limitsPatternGroupCode: number){
    let params = new HttpParams().append('primaryCoverageCode', coverageCode).append('limitsPatternGroupCode', limitsPatternGroupCode).append('programId', programId);
    console.log('happens', params)
    return this.http.get<UnderlyingLimitBasis[]>(this.config.apiBaseUrl + 'api/lookups/limit-basis', { params });
  }

  private cacheClassCodes: any;
  private cacheClassCodes$!: Observable<any> | null;

  getClassCodes(programId: number, coverageCode: string): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheClassCodes) {
      observable = of(this.cacheClassCodes);
    } else if (this.cacheClassCodes$) {
      observable = this.cacheClassCodes$;
    } else {
      console.log("codetable/deducttype");
      let params = new HttpParams().append('programId', programId).append('coverageCode', coverageCode);
      this.cacheClassCodes$ = this.http.get<Code[]>(this.config.apiBaseUrl + 'api/class-codes', { params })
        .pipe(
          tap(res => this.cacheClassCodes = res),
          share(),
          finalize(() => this.cacheClassCodes$ = null)
        );
      observable = this.cacheClassCodes$;
    }
    return observable;
  }

  clearClassCodes() {
    this.cacheClassCodes = null;
    this.cacheClassCodes$ == null;
  }

  // getClassCodes(coverageCode: string): Observable<Code[]> {
  //   const params = new HttpParams().append('coverageCode', coverageCode);
  //   return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/class-codes', { params })
  // }

  private cacheTransationTypes: any;
  private cacheTransationTypes$!: Observable<any> | null;

  getTransactionTypes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheTransationTypes) {
      observable = of(this.cacheTransationTypes);
    } else if (this.cacheTransationTypes$) {
      observable = this.cacheTransationTypes$;
    } else {
      this.cacheTransationTypes$ = this.http.get<Code[]>(this.config.apiBaseUrl + 'api/transaction-types')
        .pipe(
          tap(res => this.cacheTransationTypes = res),
          share(),
          finalize(() => this.cacheTransationTypes$ = null)
        );
      observable = this.cacheTransationTypes$;
    }
    return observable;
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

  //ClaimsMade
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

  // Deductibe Type
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


//Exposure Codes
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

  // Premium Type
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
   //Limits Pattern Descriptions
   private cacheLimitsPatternDescriptions: any;
   private cacheLimitsPatternDescriptions$!: Observable<any> | null;

   getLimitsPatternDescriptions(): Observable<Code[]> {
     let observable: Observable<any>;
     if (this.cacheDeductibleType) {
       observable = of(this.cacheLimitsPatternDescriptions);
     } else if (this.cacheLimitsPatternDescriptions$) {
       observable = this.cacheLimitsPatternDescriptions$;
     } else {
       console.log("api/dropdowns/limits-patterns");
       this.cacheLimitsPatternDescriptions$ = this.http.get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/limits-patterns')
         .pipe(
           tap(res => this.cacheLimitsPatternDescriptions = res),
           share(),
           finalize(() => this.cacheLimitsPatternDescriptions$ = null)
         );
       observable = this.cacheLimitsPatternDescriptions$;
     }
     return observable;
   }

  getAdditonalNamedInsuredsRoles(): Observable<Code[]> {
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/codetable/ANI_ROLE')
  }
}

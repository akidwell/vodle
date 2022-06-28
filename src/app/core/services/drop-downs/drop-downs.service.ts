import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { finalize, map, share, tap } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { UnderlyingLimitBasis } from '../../../features/policy/models/schedules';
import { Code } from '../../models/code';
import { State } from '../../models/state';

@Injectable({
  providedIn: 'root',
})
export class DropDownsService {
  private readonly refreshSubject = new Subject();

  constructor(private http: HttpClient, private config: ConfigService) {}

  // Non static drop downs
  getLimitBasisDescriptions(
    coverageCode: number,
    programId: number,
    limitsPatternGroupCode: number
  ) {
    const params = new HttpParams()
      .append('primaryCoverageCode', coverageCode)
      .append('limitsPatternGroupCode', limitsPatternGroupCode)
      .append('programId', programId);
    return this.http.get<UnderlyingLimitBasis[]>(
      this.config.apiBaseUrl + 'api/lookups/limit-basis',
      { params }
    );
  }

  getCoverageDescriptions(
    coverageCode: string,
    policySymbol: string,
    programId: number,
    classCode?: number | null,
    coverageID?: number | null
  ): Observable<Code[]> {
    let params = new HttpParams()
      .append('coverageCode', coverageCode)
      .append('classCode', classCode ?? '')
      .append('policySymbol', policySymbol)
      .append('programId', programId);
    if (coverageID != null) {
      params = params.append('coverageID', coverageID);
    }
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/coverage-descriptions', {
      params,
    });
  }

  getNaicsCodes(sicCode: string) {
    const params = new HttpParams().append('sicCode', sicCode);
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/naics-codes', { params });
  }

  getMarkDeadReasons(isNew: boolean) {
    const params = new HttpParams().append('isNew', isNew);
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/mark-dead-reasons', {
      params,
    });
  }

  // Policy specific drop downs
  clearPolicyDropDowns() {
    this.clearClassCodes();
  }

  getRiskGrades(programId?: number): Observable<Code[]> {
    if (programId) {
      const params = new HttpParams().append('programId', programId);
      return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/risk-grades', {
        params,
      });
    } else {
      return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/risk-grades');
    }
  }

  ////////////////////////////////////////
  // Class Codes
  private cacheClassCodes: any;
  private cacheClassCodes$!: Observable<any> | null;

  getClassCodes(programId: number, coverageCode: string): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheClassCodes) {
      observable = of(this.cacheClassCodes);
    } else if (this.cacheClassCodes$) {
      observable = this.cacheClassCodes$;
    } else {
      const params = new HttpParams()
        .append('programId', programId)
        .append('coverageCode', coverageCode);
      this.cacheClassCodes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/class-codes', { params })
        .pipe(
          tap((res) => (this.cacheClassCodes = res)),
          share(),
          finalize(() => (this.cacheClassCodes$ = null))
        );
      observable = this.cacheClassCodes$;
    }
    return observable;
  }

  clearClassCodes() {
    this.cacheClassCodes = null;
    this.cacheClassCodes$ == null;
  }

  // Static Drop Downs

  ////////////////////////////////////////
  // PAC Codes
  private cachePACCodes: any;
  private cachePACCodes$!: Observable<any> | null;

  getPACCodes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cachePACCodes) {
      observable = of(this.cachePACCodes);
    } else if (this.cachePACCodes$) {
      observable = this.cachePACCodes$;
    } else {
      this.cachePACCodes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/pac-codes')
        .pipe(
          tap((res) => (this.cachePACCodes = res)),
          share(),
          finalize(() => (this.cachePACCodes$ = null))
        );
      observable = this.cachePACCodes$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Departments
  private cacheDepartments: any;
  private cacheDepartments$!: Observable<any> | null;

  getDepartments(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheDepartments) {
      observable = of(this.cacheDepartments);
    } else if (this.cacheDepartments$) {
      observable = this.cacheDepartments$;
    } else {
      this.cacheDepartments$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/lookups/departments')
        .pipe(
          tap((res) => (this.cacheDepartments = res)),
          share(),
          finalize(() => (this.cacheDepartments$ = null))
        );
      observable = this.cacheDepartments$;
    }
    return observable;
  }
  ////////////////////////////////////////
  // Departments
  private cacheUnderwriters: any;
  private cacheUnderwriters$!: Observable<any> | null;

  getUnderwriters(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheUnderwriters) {
      observable = of(this.cacheUnderwriters);
    } else if (this.cacheUnderwriters$) {
      observable = this.cacheUnderwriters$;
    } else {
      this.cacheUnderwriters$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/lookups/underwriters')
        .pipe(
          tap((res) => (this.cacheUnderwriters = res)),
          share(),
          finalize(() => (this.cacheUnderwriters$ = null))
        );
      observable = this.cacheUnderwriters$;
    }
    return observable;
  }
  ////////////////////////////////////////
  // Programs
  private cachePrograms: any;
  private cachePrograms$!: Observable<any> | null;

  getPrograms(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cachePrograms) {
      observable = of(this.cachePrograms);
    } else if (this.cachePrograms$) {
      observable = this.cachePrograms$;
    } else {
      this.cachePrograms$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/programs')
        .pipe(
          tap((res) => (this.cachePrograms = res)),
          share(),
          finalize(() => (this.cachePrograms$ = null))
        );
      observable = this.cachePrograms$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // CoverageCodes
  private cacheCoverageCodes: any;
  private cacheCoverageCodes$!: Observable<any> | null;

  getCoverageCodes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheCoverageCodes) {
      observable = of(this.cacheCoverageCodes);
    } else if (this.cacheCoverageCodes$) {
      observable = this.cacheCoverageCodes$;
    } else {
      this.cacheCoverageCodes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/coverage-codes')
        .pipe(
          tap((res) => (this.cacheCoverageCodes = res)),
          share(),
          finalize(() => (this.cacheCoverageCodes$ = null))
        );
      observable = this.cacheCoverageCodes$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Policy Symbols
  private cachePolicySymbolsCodes: any;
  private cachePolicySymbolsCodes$!: Observable<any> | null;

  getPolicySymbols(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cachePolicySymbolsCodes) {
      observable = of(this.cachePolicySymbolsCodes);
    } else if (this.cachePolicySymbolsCodes$) {
      observable = this.cachePolicySymbolsCodes$;
    } else {
      this.cachePolicySymbolsCodes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/policy-symbols')
        .pipe(
          tap((res) => (this.cachePolicySymbolsCodes = res)),
          share(),
          finalize(() => (this.cachePolicySymbolsCodes$ = null))
        );
      observable = this.cachePolicySymbolsCodes$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // States
  private cacheStates: State[] | null = null;
  private cacheStates$!: Observable<State[]> | null;

  getStates(countryCode: string | null = null): Observable<State[]> {
    let observable: Observable<State[]>;
    if (this.cacheStates) {
      observable = of(this.cacheStates);
    } else if (this.cacheStates$) {
      observable = this.cacheStates$;
    } else {
      this.cacheStates$ = this.http
        .get<State[]>(this.config.apiBaseUrl + 'api/dropdowns/states')
        .pipe(
          tap((res) => (this.cacheStates = res)),
          share(),
          finalize(() => (this.cacheStates$ = null))
        );
      observable = this.cacheStates$;
    }
    return observable.pipe(
      map((projects) =>
        projects.filter((proj) => proj.countryCode === countryCode || countryCode === null)
      )
    );
  }

  getCountryByState(state: string): string {
    if (this.cacheStates != null) {
      const match = this.cacheStates.find(c => c.code == state);
      return match?.countryCode ?? '';
    }
    return 'USA';
  }

  ////////////////////////////////////////
  // Countries
  private cacheCountries: any;
  private cacheCountries$!: Observable<any> | null;

  getCountries(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheCountries) {
      observable = of(this.cacheCountries);
    } else if (this.cacheCountries$) {
      observable = this.cacheCountries$;
    } else {
      this.cacheCountries$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/countries')
        .pipe(
          tap((res) => (this.cacheCountries = res)),
          share(),
          finalize(() => (this.cacheCountries$ = null))
        );
      observable = this.cacheCountries$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Limits Pattern
  private cacheLimitsPattern: any;
  private cacheLimitsPattern$!: Observable<any> | null;

  getLimitsPatterns(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheLimitsPattern) {
      observable = of(this.cacheLimitsPattern);
    } else if (this.cacheLimitsPattern$) {
      observable = this.cacheLimitsPattern$;
    } else {
      this.cacheLimitsPattern$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/limits-patterns')
        .pipe(
          tap((res) => (this.cacheLimitsPattern = res)),
          share(),
          finalize(() => (this.cacheLimitsPattern$ = null))
        );
      observable = this.cacheLimitsPattern$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Limits Basis
  private cacheLimitsBasis: any;
  private cacheLimitsBasis$!: Observable<any> | null;

  getLimitsBasis(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheLimitsBasis) {
      observable = of(this.cacheLimitsBasis);
    } else if (this.cacheLimitsBasis$) {
      observable = this.cacheLimitsBasis$;
    } else {
      this.cacheLimitsBasis$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/limits-basis')
        .pipe(
          tap((res) => (this.cacheLimitsBasis = res)),
          share(),
          finalize(() => (this.cacheLimitsBasis$ = null))
        );
      observable = this.cacheLimitsBasis$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Carrier Codes
  private cacheCarrierCodes: any;
  private cacheCarrierCodes$!: Observable<any> | null;

  getCarrierCodes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheCarrierCodes) {
      observable = of(this.cacheCarrierCodes);
    } else if (this.cacheCarrierCodes$) {
      observable = this.cacheCarrierCodes$;
    } else {
      this.cacheCarrierCodes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/carrier-codes')
        .pipe(
          tap((res) => (this.cacheCarrierCodes = res)),
          share(),
          finalize(() => (this.cacheCarrierCodes$ = null))
        );
      observable = this.cacheCarrierCodes$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Audigtg Codes
  private cacheAuditCodes: any;
  private cacheAuditCodes$!: Observable<any> | null;

  getAuditCodes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheAuditCodes) {
      observable = of(this.cacheAuditCodes);
    } else if (this.cacheAuditCodes$) {
      observable = this.cacheAuditCodes$;
    } else {
      this.cacheAuditCodes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/audit-codes')
        .pipe(
          tap((res) => (this.cacheAuditCodes = res)),
          share(),
          finalize(() => (this.cacheAuditCodes$ = null))
        );
      observable = this.cacheAuditCodes$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Assumed Carriers
  private cacheAssumedCarriers: any;
  private cacheAssumedCarriers$!: Observable<any> | null;

  getAssumedCarriers(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheAssumedCarriers) {
      observable = of(this.cacheAssumedCarriers);
    } else if (this.cacheAssumedCarriers$) {
      observable = this.cacheAssumedCarriers$;
    } else {
      this.cacheAssumedCarriers$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/assumed-carriers')
        .pipe(
          tap((res) => (this.cacheAssumedCarriers = res)),
          share(),
          finalize(() => (this.cacheAssumedCarriers$ = null))
        );
      observable = this.cacheAssumedCarriers$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // NY Free Trade Zone
  private cacheNyFreeTradeZones: any;
  private cacheNyFreeTradeZones$!: Observable<any> | null;

  getNYFreeTradeZones(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheNyFreeTradeZones) {
      observable = of(this.cacheNyFreeTradeZones);
    } else if (this.cacheNyFreeTradeZones$) {
      observable = this.cacheNyFreeTradeZones$;
    } else {
      this.cacheNyFreeTradeZones$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/ny-free-trade-zones')
        .pipe(
          tap((res) => (this.cacheNyFreeTradeZones = res)),
          share(),
          finalize(() => (this.cacheNyFreeTradeZones$ = null))
        );
      observable = this.cacheNyFreeTradeZones$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Deregulation Indicators
  private cacheDeregulationIndicators: any;
  private cacheDeregulationIndicators$!: Observable<any> | null;

  getDeregulationIndicators(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheDeregulationIndicators) {
      observable = of(this.cacheDeregulationIndicators);
    } else if (this.cacheDeregulationIndicators$) {
      observable = this.cacheDeregulationIndicators$;
    } else {
      this.cacheDeregulationIndicators$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/deregulation-indicators')
        .pipe(
          tap((res) => (this.cacheDeregulationIndicators = res)),
          share(),
          finalize(() => (this.cacheDeregulationIndicators$ = null))
        );
      observable = this.cacheDeregulationIndicators$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Payment Frequencies
  private cachePaymentFrequencies: any;
  private cachePaymentFrequencies$!: Observable<any> | null;

  getPaymentFrequencies(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cachePaymentFrequencies) {
      observable = of(this.cachePaymentFrequencies);
    } else if (this.cachePaymentFrequencies$) {
      observable = this.cachePaymentFrequencies$;
    } else {
      this.cachePaymentFrequencies$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/payment-frequencies')
        .pipe(
          tap((res) => (this.cachePaymentFrequencies = res)),
          share(),
          finalize(() => (this.cachePaymentFrequencies$ = null))
        );
      observable = this.cachePaymentFrequencies$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Risk Types
  private cacheRiskTypes: any;
  private cacheRiskTypes$!: Observable<any> | null;

  getRiskTypes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheRiskTypes) {
      observable = of(this.cacheRiskTypes);
    } else if (this.cacheRiskTypes$) {
      observable = this.cacheRiskTypes$;
    } else {
      this.cacheRiskTypes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/risk-types')
        .pipe(
          tap((res) => (this.cacheRiskTypes = res)),
          share(),
          finalize(() => (this.cacheRiskTypes$ = null))
        );
      observable = this.cacheRiskTypes$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Underlying Coverage Descriptions
  private cacheUnderlyingCoverageDescriptions: any;
  private cacheUnderlyingCoverageDescriptions$!: Observable<any> | null;

  getUnderlyingCoverageDescriptions(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheUnderlyingCoverageDescriptions) {
      observable = of(this.cacheUnderlyingCoverageDescriptions);
    } else if (this.cacheUnderlyingCoverageDescriptions$) {
      observable = this.cacheUnderlyingCoverageDescriptions$;
    } else {
      this.cacheUnderlyingCoverageDescriptions$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/underlying-coverage-descriptions')
        .pipe(
          tap((res) => (this.cacheUnderlyingCoverageDescriptions = res)),
          share(),
          finalize(() => (this.cacheUnderlyingCoverageDescriptions$ = null))
        );
      observable = this.cacheUnderlyingCoverageDescriptions$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Transation Types
  private cacheTransationTypes: any;
  private cacheTransationTypes$!: Observable<any> | null;

  getTransactionTypes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheTransationTypes) {
      observable = of(this.cacheTransationTypes);
    } else if (this.cacheTransationTypes$) {
      observable = this.cacheTransationTypes$;
    } else {
      this.cacheTransationTypes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/transaction-types')
        .pipe(
          tap((res) => (this.cacheTransationTypes = res)),
          share(),
          finalize(() => (this.cacheTransationTypes$ = null))
        );
      observable = this.cacheTransationTypes$;
    }
    return observable;
  }

  /////////////////////////////////
  ///Endorsement Reasons
  private cacheEndorsementReasons: any;
  private cacheEndorsementReasons$!: Observable<any> | null;
  getEndorsementReasons(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheEndorsementReasons) {
      observable = of(this.cacheEndorsementReasons);
    } else if (this.cacheEndorsementReasons$) {
      observable = this.cacheEndorsementReasons$;
    } else {
      this.cacheEndorsementReasons$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/codetable/pro_reason_code')
        .pipe(
          tap((res) => (this.cacheEndorsementReasons = res)),
          share(),
          finalize(() => (this.cacheEndorsementReasons$ = null))
        );
      observable = this.cacheEndorsementReasons$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Terrorism Codes
  private cacheTerrorismCodes: any;
  private cacheTerrorismCodes$!: Observable<any> | null;

  getTerrorismCodes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheTerrorismCodes) {
      observable = of(this.cacheTerrorismCodes);
    } else if (this.cacheTerrorismCodes$) {
      observable = this.cacheTerrorismCodes$;
    } else {
      this.cacheTerrorismCodes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/codetable/terrorism_code')
        .pipe(
          tap((res) => (this.cacheTerrorismCodes = res)),
          share(),
          finalize(() => (this.cacheTerrorismCodes$ = null))
        );
      observable = this.cacheTerrorismCodes$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Actions
  private cacheActions: any;
  private cacheActions$!: Observable<any> | null;

  getActionCodes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheActions) {
      observable = of(this.cacheActions);
    } else if (this.cacheActions$) {
      observable = this.cacheActions$;
    } else {
      this.cacheActions$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/codetable/coverage_action')
        .pipe(
          tap((res) => (this.cacheActions = res)),
          share(),
          finalize(() => (this.cacheActions$ = null))
        );
      observable = this.cacheActions$;
    }
    return observable;
  }

  ////////////////////////////////////////
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
      this.cacheClaimsMade$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/codetable/claimsmade')
        .pipe(
          tap((res) => (this.cacheClaimsMade = res)),
          share(),
          finalize(() => (this.cacheClaimsMade$ = null))
        );
      observable = this.cacheClaimsMade$;
    }
    return observable;
  }

  ////////////////////////////////////////
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
      this.cacheDeductibleType$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/codetable/deducttype')
        .pipe(
          tap((res) => (this.cacheDeductibleType = res)),
          share(),
          finalize(() => (this.cacheDeductibleType$ = null))
        );
      observable = this.cacheDeductibleType$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // EachEmployee Deductible
  private cacheEachEmployee: any;
  private cacheEachEmployee$!: Observable<any> | null;

  getEachEmployeeDeductible(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheEachEmployee) {
      observable = of(this.cacheEachEmployee);
    } else if (this.cacheEachEmployee$) {
      observable = this.cacheEachEmployee$;
    } else {
      this.cacheEachEmployee$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/codetable/eachemployee')
        .pipe(
          tap((res) => (this.cacheEachEmployee = res)),
          share(),
          finalize(() => (this.cacheEachEmployee$ = null))
        );
      observable = this.cacheEachEmployee$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Entity Type
  private cacheEntityType: any;
  private cacheEntityType$!: Observable<any> | null;

  getEntityType(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheEntityType) {
      observable = of(this.cacheEntityType);
    } else if (this.cacheEntityType$) {
      observable = this.cacheEntityType$;
    } else {
      this.cacheEntityType$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/codetable/insured_entity_type')
        .pipe(
          tap((res) => (this.cacheEntityType = res)),
          share(),
          finalize(() => (this.cacheEntityType$ = null))
        );
      observable = this.cacheEntityType$;
    }
    return observable;
  }

  ////////////////////////////////////////
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
      this.cacheExposureCodes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/exposure-codes')
        .pipe(
          tap((res) => (this.cacheExposureCodes = res)),
          share(),
          finalize(() => (this.cacheExposureCodes$ = null))
        );
      observable = this.cacheExposureCodes$;
    }
    return observable;
  }

  ////////////////////////////////////////
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
      this.cachePremTypes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/codetable/premtype')
        .pipe(
          tap((res) => (this.cachePremTypes = res)),
          share(),
          finalize(() => (this.cachePremTypes$ = null))
        );
      observable = this.cachePremTypes$;
    }
    return observable;
  }

  ////////////////////////////////////////
  //Limits Pattern Descriptions
  private cacheLimitsPatternDescriptions: any;
  private cacheLimitsPatternDescriptions$!: Observable<any> | null;

  getLimitsPatternDescriptions(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheLimitsPatternDescriptions) {
      observable = of(this.cacheLimitsPatternDescriptions);
    } else if (this.cacheLimitsPatternDescriptions$) {
      observable = this.cacheLimitsPatternDescriptions$;
    } else {
      this.cacheLimitsPatternDescriptions$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/limits-patterns')
        .pipe(
          tap((res) => (this.cacheLimitsPatternDescriptions = res)),
          share(),
          finalize(() => (this.cacheLimitsPatternDescriptions$ = null))
        );
      observable = this.cacheLimitsPatternDescriptions$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // ANI Roles
  private cacheAdditonalNamedInsuredsRoles: any;
  private cacheAdditonalNamedInsuredsRoles$!: Observable<any> | null;

  getAdditonalNamedInsuredsRoles(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheAdditonalNamedInsuredsRoles) {
      observable = of(this.cacheAdditonalNamedInsuredsRoles);
    } else if (this.cacheAdditonalNamedInsuredsRoles$) {
      observable = this.cacheAdditonalNamedInsuredsRoles$;
    } else {
      this.cacheAdditonalNamedInsuredsRoles$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/codetable/ani_role')
        .pipe(
          tap((res) => (this.cacheAdditonalNamedInsuredsRoles = res)),
          share(),
          finalize(() => (this.cacheAdditonalNamedInsuredsRoles$ = null))
        );
      observable = this.cacheAdditonalNamedInsuredsRoles$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Sic Codes
  private cacheSicCodes: any;
  private cacheSicCodes$!: Observable<any> | null;

  getSicCodes(): Observable<Code[]> {
    let observable: Observable<any>;
    if (this.cacheSicCodes) {
      observable = of(this.cacheSicCodes);
    } else if (this.cacheSicCodes$) {
      observable = this.cacheSicCodes$;
    } else {
      this.cacheSicCodes$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/sic-codes')
        .pipe(
          tap((res) => (this.cacheSicCodes = res)),
          share(),
          finalize(() => (this.cacheSicCodes$ = null))
        );
      observable = this.cacheSicCodes$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Submission Events
  private cacheSubmissionEvents: Code[] | null = null;
  private cacheSubmissionEvents$!: Observable<Code[]> | null;

  getSubmissionEvents(): Observable<Code[]> {
    let observable: Observable<Code[]>;
    if (this.cacheSubmissionEvents) {
      observable = of(this.cacheSubmissionEvents);
    } else if (this.cacheSubmissionEvents$) {
      observable = this.cacheSubmissionEvents$;
    } else {
      this.cacheSubmissionEvents$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/submission-events')
        .pipe(
          tap((res) => (this.cacheSubmissionEvents = res)),
          share(),
          finalize(() => (this.cacheSubmissionEvents$ = null))
        );
      observable = this.cacheSubmissionEvents$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Mark Decline Reasons
  private cacheMarkDeclineReasons: Code[] | null = null;
  private cacheMarkDeclineReasons$!: Observable<Code[]> | null;

  getMarkDeclineReasons(): Observable<Code[]> {
    let observable: Observable<Code[]>;
    if (this.cacheMarkDeclineReasons) {
      observable = of(this.cacheMarkDeclineReasons);
    } else if (this.cacheMarkDeclineReasons$) {
      observable = this.cacheMarkDeclineReasons$;
    } else {
      this.cacheMarkDeclineReasons$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/mark-decline-reasons')
        .pipe(
          tap((res) => (this.cacheMarkDeclineReasons = res)),
          share(),
          finalize(() => (this.cacheMarkDeclineReasons$ = null))
        );
      observable = this.cacheMarkDeclineReasons$;
    }
    return observable;
  }

  ////////////////////////////////////////
  // Reactivate Reasons
  private cacheReactivateReasons: Code[] | null = null;
  private cacheReactivateReasons$!: Observable<Code[]> | null;

  getReactivateReasons(): Observable<Code[]> {
    let observable: Observable<Code[]>;
    if (this.cacheReactivateReasons) {
      observable = of(this.cacheReactivateReasons);
    } else if (this.cacheReactivateReasons$) {
      observable = this.cacheReactivateReasons$;
    } else {
      this.cacheReactivateReasons$ = this.http
        .get<Code[]>(this.config.apiBaseUrl + 'api/dropdowns/reactivate-reasons')
        .pipe(
          tap((res) => (this.cacheReactivateReasons = res)),
          share(),
          finalize(() => (this.cacheReactivateReasons$ = null))
        );
      observable = this.cacheReactivateReasons$;
    }
    return observable;
  }
}

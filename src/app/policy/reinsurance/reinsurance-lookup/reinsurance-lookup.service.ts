import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { finalize, share, tap } from 'rxjs/operators';
import { ConfigService } from 'src/app/config/config.service';
import { ReinsuranceLookup } from './reinsurance-lookup';

@Injectable({
  providedIn: 'root'
})
export class ReinsuranceLookupService {
  private refreshed = new Subject<any>();

  refreshed$ = this.refreshed.asObservable();
  
  constructor(private http: HttpClient, private config: ConfigService) { }

  ////////////////////////////////////////
  // Reinsurance Codes
  private cacheReinsuranceCodes: any;
  private cacheReinsuranceCodes$!: Observable<any> | null;

  getReinsurance(programId: number,effectiveDate: Date): Observable<ReinsuranceLookup[]> {
    let observable: Observable<any>;
    if (this.cacheReinsuranceCodes) {
      observable = of(this.cacheReinsuranceCodes);
    } else if (this.cacheReinsuranceCodes$) {
      observable = this.cacheReinsuranceCodes$;
    } else {
      const params = new HttpParams().append('programId', programId).append('effectiveDate', effectiveDate.toString());
      this.cacheReinsuranceCodes$ = this.http.get<ReinsuranceLookup[]>(this.config.apiBaseUrl + 'api/lookups/reinsurance-agreements', { params })
        .pipe(
          tap(res => this.cacheReinsuranceCodes = res),
          share(),
          finalize(() => this.cacheReinsuranceCodes$ = null)
        );
      observable = this.cacheReinsuranceCodes$;
    }
    return observable;
  }

  clearReinsuranceCodes() {
    this.cacheReinsuranceCodes = null;
    this.cacheReinsuranceCodes$ == null;
    this.cacheFaculativeReinsuranceCodes = null;
    this.cacheFaculativeReinsuranceCodes$ == null; 
  }

  refreshReinsuranceCodes() {
    this.refreshed.next();
  }
    
  ////////////////////////////////////////
  // Faculative Reinsurance Codes
  private cacheFaculativeReinsuranceCodes: any;
  private cacheFaculativeReinsuranceCodes$!: Observable<any> | null;

  getFaculativeReinsurance(effectiveDate: Date): Observable<ReinsuranceLookup[]> {
    let observable: Observable<any>;
    if (this.cacheFaculativeReinsuranceCodes) {
      observable = of(this.cacheFaculativeReinsuranceCodes);
    } else if (this.cacheFaculativeReinsuranceCodes$) {
      observable = this.cacheFaculativeReinsuranceCodes$;
    } else {
      const params = new HttpParams().append('effectiveDate', effectiveDate.toString());
      this.cacheFaculativeReinsuranceCodes$ =  this.http.get<ReinsuranceLookup[]>(this.config.apiBaseUrl + 'api/lookups/faculative-agreements', { params })
        .pipe(
          tap(res => this.cacheFaculativeReinsuranceCodes = res),
          share(),
          finalize(() => this.cacheFaculativeReinsuranceCodes$ = null)
        );
      observable = this.cacheFaculativeReinsuranceCodes$;
    }
    return observable;
  }

}

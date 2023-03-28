import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { AdvancedSearchRequest, SearchResults } from '../../models/search-results';

@Injectable({
  providedIn: 'root'
})
export class PolicySearchService {
  formatDateForDisplay: FormatDateForDisplay = new FormatDateForDisplay();
  private _loading$ = new BehaviorSubject<boolean>(false);
  results: SearchResults = {
    policySearchResponses: [],
    submissionSearchResponses: [],
    insuredSearchResponses: [],
    searchType: null
  };

  searchResults = new BehaviorSubject<SearchResults>(this.results);

  get loading$() { return this._loading$.asObservable(); }

  constructor(private http: HttpClient, private config: ConfigService) { }

  getPolicySearch(filter: string): Observable<SearchResults> {
    const params = new HttpParams().append('filter', filter);
    this._loading$.next(true);
    this.searchResults.next(this.results);
    return this.http.get<SearchResults>(this.config.apiBaseUrl + 'api/policies/search', { params })
      .pipe(
        tap(result => this.searchResults.next(result)),
        tap(() => this._loading$.next(false)),
        catchError((error) => {
          this._loading$.next(false);
          throw (error);
        })
      );
  }

  getAdvancedSearch(request: AdvancedSearchRequest): Observable<SearchResults>{
    var params = new HttpParams();

    if(request.filter != null) params = params.append('filter', request.filter);
    if(request.departmentCode != null) params = params.append('departmentCode', request.departmentCode)
    if(request.programID != null) params = params.append('programID', request.programID);
    if(request.status != null) params = params.append('status', request.status);
    if(request.underwriterID != null) params = params.append('underwriterID', request.underwriterID);
    if(request.subStartDate != null) params = params.append('subStartDate', this.formatDateForDisplay.formatDateForDisplay(request.subStartDate) ?? "");
    if(request.subEndDate != null) params = params.append('subEndDate', this.formatDateForDisplay.formatDateForDisplay(request.subEndDate) ?? "");
    if(request.polEffStartDate != null) params = params.append('polEffStartDate', this.formatDateForDisplay.formatDateForDisplay(request.polEffStartDate) ?? "");
    if(request.polEffEndDate != null) params = params.append('polEffEndDate', this.formatDateForDisplay.formatDateForDisplay(request.polEffEndDate) ?? "");
    if(request.srtRenewalFlag != null) params = params.append('srtNewRenewalFlag', request.srtRenewalFlag);
    if(request.producerCode != null) params = params.append('producerCode', request.producerCode);

    this._loading$.next(true);
    this.searchResults.next(this.results);
    return this.http.get<SearchResults>(this.config.apiBaseUrl + 'api/policies/advancedsearch', { params })
      .pipe(
        tap(result => this.searchResults.next(result)),
        tap(() => this._loading$.next(false)),
        catchError((error) => {
          this._loading$.next(false);
          throw (error);
        })
      );
  }
}

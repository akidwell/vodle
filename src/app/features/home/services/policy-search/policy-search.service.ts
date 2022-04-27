import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { APIVersionService } from 'src/app/core/services/API-version-service/api-version.service';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { SearchResults } from '../../models/search-results';

@Injectable({
  providedIn: 'root'
})
export class PolicySearchService {
  private _loading$ = new BehaviorSubject<boolean>(false);
  results: SearchResults = {
    policySearchResponses: [],
    submissionSearchResponses: [],
    insuredSearchResponses: []};

  searchResults = new BehaviorSubject<SearchResults>(this.results);

  get loading$() { return this._loading$.asObservable(); }

  constructor(private http: HttpClient, private config: ConfigService, private apiService: APIVersionService) { }

  getPolicySearch(filter: string): Observable<SearchResults> {
    const params = new HttpParams().append('filter', filter);
    this._loading$.next(true)
    return this.http.get<SearchResults>(this.config.apiBaseUrl + 'api/policies/search', { params,  'headers': { 'X-Version': this.apiService.getApiVersion} })
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

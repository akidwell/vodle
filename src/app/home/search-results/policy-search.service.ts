import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from 'src/app/config/config.service';
import { PolicySearchResults } from './policy-search-results';

@Injectable({
  providedIn: 'root'
})
export class PolicySearchService {
  private _loading$ = new BehaviorSubject<boolean>(false);
  searchResults = new BehaviorSubject<PolicySearchResults[]>([]);

  get loading$() { return this._loading$.asObservable(); }

  constructor(private http: HttpClient, private config: ConfigService) { }

  getPolicySearch(filter: string): Observable<PolicySearchResults[]> {
    const params = new HttpParams().append('filter', filter);
    this._loading$.next(true)
    return this.http.get<PolicySearchResults[]>(this.config.apiBaseUrl + 'api/policies/search', { params })
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

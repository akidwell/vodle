import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from 'src/app/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionSearchService {
  private _loading$ = new BehaviorSubject<boolean>(false);

  get loading$() { return this._loading$.asObservable(); }

  constructor(private http: HttpClient, private config: ConfigService) { }

  getPolicySearch(filter: number): Observable<boolean> {
    const params = new HttpParams().append('submissionNumber', filter.toString());
    this._loading$.next(true)
    return this.http.get<boolean>(this.config.apiBaseUrl + 'api/lookups/submission-search', { params })
      .pipe(
        tap(result => { return result; }),
        tap(() => this._loading$.next(false)),
        catchError((error) => {
          this._loading$.next(false);
          throw (error);
        })
      );
  }
}

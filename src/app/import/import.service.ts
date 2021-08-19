import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { IImportPolicy } from './import-policy';
import { IImportParameter } from './import-parameter';
import { IImportResult } from './import-response';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getImportPolicies(): Observable<IImportPolicy[]> {
    return this.http.get<IImportPolicy[]>(this.config.apiBaseUrl + 'api/import-policies')
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }
  
  postImportPolicies(parm: IImportParameter): Observable<IImportResult> {
    return this.http.post<IImportResult>(this.config.apiBaseUrl + 'api/import-policies',parm)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  
}

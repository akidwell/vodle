import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from "../config/config.service";
import { IVersion } from "./version";

@Injectable({
    providedIn: 'root'
  })
  export class VersionService {

    constructor(private http: HttpClient, private config: ConfigService) { }

    getVersion(): Observable<IVersion> {
        const options = {responseType: 'text'};

        return this.http.get<IVersion>(this.config.apiBaseUrl + 'api/monitoring/version')
          .pipe(
            tap(data => console.log('All: ', JSON.stringify(data))),
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

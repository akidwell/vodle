import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable} from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from "../config/config.service";
import { ErrorDialogService } from "../error-handling/error-dialog-service/error-dialog-service";
import { Version, newVersion } from "./version";

@Injectable({
    providedIn: 'root'
  })
  export class VersionService {

    constructor(private http: HttpClient, private config: ConfigService, private errorDialogService: ErrorDialogService) { }

    getVersion(): Observable<Version> {
        const options = {responseType: 'text'};

        return this.http.get<Version>(this.config.apiBaseUrl + 'api/monitoring/version')
          .pipe(
            tap(data => console.log('All: ', JSON.stringify(data))),
            catchError((error) => this.handleError(error))
         );
      }

      handleError(err: HttpErrorResponse): Observable<Version>  {
        this.errorDialogService.open("Service Error","Cannot connect to the Backend Api. Message: " + err.message);
        return of(newVersion());
      }
  }

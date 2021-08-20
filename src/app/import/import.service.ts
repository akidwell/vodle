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
        tap(data => console.log(JSON.stringify(data)))
      );
  }
  
  postImportPolicies(parm: IImportParameter): Observable<IImportResult> {
    return this.http.post<IImportResult>(this.config.apiBaseUrl + 'api/import-policies',parm)
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }
  
}

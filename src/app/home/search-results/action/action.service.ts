import { state } from '@angular/animations';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from 'src/app/config/config.service';
import { Code } from 'src/app/drop-downs/code';
import { ImportPolicy } from 'src/app/import/interfaces/import-policy';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getEndorsementNumbers(policyId: number): Observable<Code[]> {
    const params = new HttpParams().append('policyId', policyId);
    return this.http.get<Code[]>(this.config.apiBaseUrl + 'api/lookups/endorsement-numbers', {params}).pipe(
      tap(data =>  JSON.stringify(data)),
   );
  }
}
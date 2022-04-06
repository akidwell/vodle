import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { EndorsementNumberResponse } from 'src/app/features/policy/models/policy';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getEndorsementNumbers(policyId: number): Observable<EndorsementNumberResponse[]> {
    const params = new HttpParams().append('policyId', policyId);
    return this.http.get<EndorsementNumberResponse[]>(this.config.apiBaseUrl + 'api/lookups/endorsement-numbers', {params});
  }
}
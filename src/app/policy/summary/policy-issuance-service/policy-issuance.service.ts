import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/config/config.service';
import { PolicyIssuanceRequest } from './policy-issuance-request';
import { PolicyIssuanceResponse } from './policy-issuance-response';

@Injectable({
  providedIn: 'root'
})
export class PolicyIssuanceService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  postPolicyIssuance(parm: PolicyIssuanceRequest): Observable<PolicyIssuanceResponse> {
    return this.http.post<PolicyIssuanceResponse>(this.config.apiBaseUrl + 'api/policy-issuance',parm)
  };

}

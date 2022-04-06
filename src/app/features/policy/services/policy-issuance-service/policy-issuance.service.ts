import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { PolicyIssuanceRequest } from '../../models/policy-issuance-request';
import { PolicyIssuanceResponse } from '../../models/policy-issuance-response';

@Injectable({
  providedIn: 'root'
})
export class PolicyIssuanceService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  postPolicyIssuance(parm: PolicyIssuanceRequest): Observable<PolicyIssuanceResponse> {
    return this.http.post<PolicyIssuanceResponse>(this.config.apiBaseUrl + 'api/policy-issuance',parm)
  };

}

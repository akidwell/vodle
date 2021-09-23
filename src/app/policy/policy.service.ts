import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { EndorsementCoveragesGroup } from './coverages/coverages';
import { AccountInformation, Policy, PolicyInformation } from './policy';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getPolicy(id: number): Observable<Policy> {
    return this.http.get<Policy>(this.config.apiBaseUrl + 'api/policies/' + id.toString())
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }

  getPolicyAccountInfo(id: number): Observable<AccountInformation> {
    return this.http.get<AccountInformation>(this.config.apiBaseUrl + 'api/policies/AccountInfo/' + id.toString())
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }

  getPolicyInfo(id: number): Observable<PolicyInformation> {
    return this.http.get<PolicyInformation>(this.config.apiBaseUrl + 'api/policies/PolicyInfo/' + id.toString())
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }
  getEndorsementCoveragesGroups(policyId: number, endorsementNo: number): Observable<EndorsementCoveragesGroup[]> {
    return this.http.get<EndorsementCoveragesGroup[]>(this.config.apiBaseUrl + 'api/policies/' + policyId.toString() + '/' + endorsementNo + '/coveragesgroups')
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }
}

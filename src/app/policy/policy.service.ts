import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { EndorsementCoverage, EndorsementCoverageLocation, EndorsementCoveragesGroup } from './coverages/coverages';
import { AccountInformation, Endorsement, Policy, PolicyInformation } from './policy';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  // Currently not used!!!!
  // getPolicy(id: number): Observable<Policy> {
  //   return this.http.get<Policy>(this.config.apiBaseUrl + 'api/policies/' + id.toString())
  //     .pipe(
  //       tap(data => console.log(JSON.stringify(data)))
  //     );
  // }

  getPolicyAccountInfo(id: number): Observable<AccountInformation> {
    return this.http.get<AccountInformation>(this.config.apiBaseUrl + 'api/policies/'  + id.toString() + '/accountinfo')
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }

  getPolicyInfo(id: number): Observable<PolicyInformation> {
    return this.http.get<PolicyInformation>(this.config.apiBaseUrl + 'api/policies/'  + id.toString() + '/policyinfo')
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }

  getEndorsement(id: number,endorsementNumber: number): Observable<Endorsement> {
    return this.http.get<Endorsement>(this.config.apiBaseUrl + 'api/policies/' + id.toString() + '/endorsements/' + endorsementNumber.toString())
  }

  getEndorsementCoveragesGroups(policyId: number, endorsementNo: number): Observable<EndorsementCoveragesGroup[]> {
    return this.http.get<EndorsementCoveragesGroup[]>(this.config.apiBaseUrl + 'api/policies/' + policyId.toString() + '/endorsements/' + endorsementNo + '/coveragesgroups')
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }

  updateEndorsement(endorsement: Endorsement): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements', endorsement)
      .pipe(
        tap(data => console.log(JSON.stringify(data)))
      );
  }
  updateEndorsementGroups(endorsementCoveragesGroups: EndorsementCoveragesGroup[]) : Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/coveragesgroups', endorsementCoveragesGroups);
  }

  addEndorsementCoverageLocation(location: EndorsementCoverageLocation): Observable<number> {
    return this.http.post<number>(this.config.apiBaseUrl + 'api/policies/endorsement-coverage-locations/', location)
  }

  updateEndorsementCoverageLocation(location: EndorsementCoverageLocation): Observable<number> {
    return this.http.put<number>(this.config.apiBaseUrl + 'api/policies/endorsement-coverage-locations/', location)
  }
  
  deleteEndorsementCoverageLocation(location: EndorsementCoverageLocation): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/policies/' + location.policyId.toString()
    + '/endorsement-coverage-locations/' + location.locationId.toString() )
  }

  updatePolicyInfo(policyInfo: PolicyInformation): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/PolicyInfo', policyInfo);
  }

  updateAccountInfo(accountInfo: AccountInformation):Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/AccountInfo', accountInfo);
  }
  deleteEndorsementCoverage(coverage: EndorsementCoverage): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/policies/' + coverage.policyId.toString()
    + '/endorsements/' + coverage.endorsementNumber.toString() + '/coverages/' + coverage.sequence.toString() )
  }

}

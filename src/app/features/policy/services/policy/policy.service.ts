import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfigService } from '../../../../core/services/config/config.service';
import { NewEndorsementData } from '../../../home/models/policy-search-results';
import { AdditionalNamedInsured, coverageANI } from '../../../../shared/components/additional-named-insured/additional-named-insured';
import { EndorsementCoverageLocation, EndorsementCoveragesGroup, EndorsementCoverage } from '../../components/coverages-base/coverages';
import { AccountInformation, AdditionalNamedInsureds, Endorsement, EndorsementLocation, PolicyAddResponse, PolicyData, PolicyInformation, PolicyLayerData, ReinsuranceLayerData } from '../../models/policy';
import { UnderlyingCoverage } from '../../models/schedules';
import { InvoiceData, InvoiceDetail } from '../../models/invoice';
import { UCCoverage } from '../../classes/UCCoverage';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  addPolicy(policy: PolicyData): Observable<PolicyAddResponse> {
    return this.http.post<PolicyAddResponse>(this.config.apiBaseUrl + 'api/policies', policy);
  }
  getPolicyAccountInfo(id: number): Observable<AccountInformation> {
    return this.http.get<AccountInformation>(this.config.apiBaseUrl + 'api/policies/' + id.toString() + '/accountinfo');
  }
  getPolicyInfo(id: number): Observable<PolicyInformation> {
    return this.http.get<PolicyInformation>(this.config.apiBaseUrl + 'api/policies/' + id.toString() + '/policyinfo');
  }
  getEndorsement(id: number, endorsementNumber: number): Observable<Endorsement> {
    return this.http.get<Endorsement>(this.config.apiBaseUrl + 'api/policies/' + id.toString() + '/endorsements/' + endorsementNumber.toString());
  }
  getEndorsementCoveragesGroups(policyId: number, endorsementNo: number): Observable<EndorsementCoveragesGroup[]> {
    return this.http.get<EndorsementCoveragesGroup[]>(this.config.apiBaseUrl + 'api/policies/' + policyId.toString() + '/endorsements/' + endorsementNo + '/coveragesgroups');
  }
  getUnderlyingCoverages(policyId: number, endorsementNo: number): Observable<UCCoverage[]> {
    return this.http.get<UnderlyingCoverage[]>(this.config.apiBaseUrl + 'api/policies/' + policyId.toString() + '/endorsements/' + endorsementNo + '/underlying-schedule')
    .pipe(
      map((receivedData: UnderlyingCoverage[]) => {
          var data: UCCoverage[] = [];
          receivedData.forEach(element => {
            data.push(new UCCoverage(element))
          });
          return data;
      }));
  }
  updateUnderlyingCoverages(underlyingCoverages: UnderlyingCoverage[]): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/underlying-schedule', underlyingCoverages);
  }
  deleteUnderlyingCoverage(coverage: UnderlyingCoverage): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/policies/' + coverage.policyId.toString()
      + '/endorsements/' + coverage.endorsementNo.toString() + '/underlying-schedule/' + coverage.sequence.toString());
  }
  updateEndorsement(endorsement: Endorsement): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements', endorsement);
  }
  deleteEndorsement(policyId: number, endorsementNo: number): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/policies/' + policyId.toString()
      + '/endorsements/' + endorsementNo.toString());
  }
  updateEndorsementGroups(endorsementCoveragesGroups: EndorsementCoveragesGroup[]): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/coveragesgroups', endorsementCoveragesGroups);
  }
  addEndorsementCoverageLocation(location: EndorsementCoverageLocation): Observable<number> {
    return this.http.post<number>(this.config.apiBaseUrl + 'api/policies/endorsement-coverage-locations/', location);
  }
  updateEndorsementCoverageLocation(location: EndorsementCoverageLocation): Observable<number> {
    return this.http.put<number>(this.config.apiBaseUrl + 'api/policies/endorsement-coverage-locations/', location);
  }
  deleteEndorsementCoverageLocation(location: EndorsementCoverageLocation): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/policies/' + location.policyId.toString()
      + '/endorsement-coverage-locations/' + location.locationId.toString())
  }
  updatePolicyInfo(policyInfo: PolicyInformation): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/policyinfo', policyInfo);
  }
  updateAccountInfo(accountInfo: AccountInformation): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/AccountInfo', accountInfo);
  }
  deleteEndorsementCoverage(coverage: EndorsementCoverage): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/policies/' + coverage.policyId.toString()
      + '/endorsements/' + coverage.endorsementNumber.toString() + '/coverages/' + coverage.sequence.toString());
  }
  getAdditionalNamedInsureds(policyId: number, endorsementNo: number): Observable<AdditionalNamedInsureds[]> {
    return this.http.get<AdditionalNamedInsureds[]>(this.config.apiBaseUrl + 'api/policies/' + policyId + '/endorsements/' + endorsementNo + '/additional-insureds');
  }
  updateAdditionalNamedInsureds(aniData: AdditionalNamedInsureds): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/additional-insureds/', aniData);
  }
  addAdditionalNamedInsureds(aniData: AdditionalNamedInsureds): Observable<boolean> {
    return this.http.post<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/additional-insureds/', aniData);
  }
  deleteAdditionalNamedInsureds(ani: AdditionalNamedInsureds): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/policies/' + ani.policyId + '/endorsements/' + ani.endorsementNo + '/additional-insureds/' + ani.sequenceNo);
  }
  getEndorsementLocation(policyId: number, endorsementNo: number): Observable<EndorsementLocation[]> {
    return this.http.get<EndorsementLocation[]>(this.config.apiBaseUrl + 'api/policies/' + policyId + '/endorsements/' + endorsementNo + '/locations');
  }
  addEndorsementLocation(location: EndorsementLocation): Observable<boolean> {
    return this.http.post<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/locations/', location);
  }
  updateEndorsementLocation(location: EndorsementLocation): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/locations/', location)
      .pipe(
        catchError(() => {
          return of(false);
        })
      );
  }
  deleteEndorsementLocation(location: EndorsementLocation): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/policies/' + location.policyId + '/endorsements/' + location.endorsementNumber + '/locations/' + location.sequence);
  }
  getPolicyAndReinsuranceLayers(policyId: number, endorsementNo: number): Observable<PolicyLayerData[]> {
    return this.http.get<PolicyLayerData[]>(this.config.apiBaseUrl + 'api/policies/' + policyId + '/endorsements/' + endorsementNo + '/reinsurance');
  }
  putPolicyAndReinsuranceLayers(data: PolicyLayerData[]): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/reinsurance', data);

  }
  deleteReinsuranceLayers(reinsuranceLayer: ReinsuranceLayerData): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/policies/' + reinsuranceLayer.policyId + '/endorsements/' + reinsuranceLayer.endorsementNumber + '/reinsurance/' + reinsuranceLayer.policyLayerNo + '/' + reinsuranceLayer.reinsLayerNo);
  }
  deletePolicyAndReinsuranceLayers(reinsuranceLayer: ReinsuranceLayerData): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/policies/' + reinsuranceLayer.policyId + '/endorsements/' + reinsuranceLayer.endorsementNumber + '/policy-reinsurance/' + reinsuranceLayer.policyLayerNo + '/' + reinsuranceLayer.reinsLayerNo);
  }
  getPolicyInvoices(policyId: number, endorsementNo: number): Observable<InvoiceData[]> {
    return this.http.get<InvoiceData[]>(this.config.apiBaseUrl + 'api/policies/' + policyId + '/endorsements/' + endorsementNo + '/invoices');
  }

  addPolicyInvoice(invoice: InvoiceData): Observable<boolean> {
    return this.http.post<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/invoices/', invoice);
  }
  updatePolicyInvoice(invoice: InvoiceData): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/invoices/', invoice);
  }
  deletePolicyInvoiceDetails(policyId: number, endorsementNo: number, invoiceNumber: number, lineNumber: number): Observable<InvoiceData[]> {
    return this.http.delete<InvoiceData[]>(this.config.apiBaseUrl + 'api/policies/' + policyId + '/endorsements/' + endorsementNo + '/invoices/' + invoiceNumber + '/details/' + lineNumber);
  }

  createNewEndorsement(data: NewEndorsementData): Observable<NewEndorsementData>{
    return this.http.post<NewEndorsementData>(this.config.apiBaseUrl + 'api/policies/endorsements', data);

  }
  getPolicyLineItems(policyId: number, endorsementNo: number): Observable<InvoiceDetail[]> {
    return this.http.get<InvoiceDetail[]>(this.config.apiBaseUrl + 'api/policies/' + policyId + '/endorsements/' + endorsementNo + '/line-items');
  }

  //////////////////////////////////////////////////////////////////////
  // Component research
  getAdditionalNamedInsured(policyId: number, endorsementNo: number): Observable<coverageANI[]> {
    return this.http.get<AdditionalNamedInsured[]>(this.config.apiBaseUrl + 'api/policies/' + policyId + '/endorsements/' + endorsementNo + '/additional-insureds')
    .pipe(
      map((receivedData: AdditionalNamedInsured[]) => {
          var data: coverageANI[] = [];
          receivedData.forEach(element => {
            data.push(new coverageANI(this,element))
          });
          return data;
      }));
  }

  addAdditionalNamedInsured(aniData: coverageANI): Observable<coverageANI> {
    return this.http.post<coverageANI>(this.config.apiBaseUrl + 'api/policies/endorsements/additional-insureds/', aniData);
  }
  updateAdditionalNamedInsured(aniData: coverageANI): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/additional-insureds/', aniData);
  }
  deleteAdditionalNamedInsured(aniData: coverageANI): Observable<boolean> {
    return this.http.delete<boolean>(this.config.apiBaseUrl + 'api/policies/' + aniData.policyId + '/endorsements/' + aniData.endorsementNo + '/additional-insureds/' + aniData.sequenceNo);
  }
}

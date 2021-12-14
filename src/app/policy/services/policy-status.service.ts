import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from 'src/app/config/config.service';
import { EndorsementStatusData } from '../policy';

@Injectable({
  providedIn: 'root'
})
export class PolicyStatusService {
  private _status!: EndorsementStatusData;

  status = new BehaviorSubject<string>("");
  readonly = new BehaviorSubject<boolean>(false);

  private _policyInfoValidated = new BehaviorSubject<boolean>(false);
  policyInfoValidated$ = this._policyInfoValidated.asObservable();
  get policyInfoValidated(): boolean { return this._policyInfoValidated.getValue(); }
  set policyInfoValidated(value: boolean) {
    this._status.isPolicyValidated = value;
    this.updateEndorsementStatus(this._status).toPromise();
    this._policyInfoValidated.next(value);
  }

  private _coverageValidated = new BehaviorSubject<boolean>(false);
  coverageValidated$ = this._coverageValidated.asObservable();
  get coverageValidated(): boolean { return this._coverageValidated.getValue(); }
  set coverageValidated(value: boolean) {
    this._status.isCoverageValidated = value;
    this.updateEndorsementStatus(this._status).toPromise();
    this._coverageValidated.next(value);
  }

  private _reinsuranceValidated = new BehaviorSubject<boolean>(false);
  reinsuranceValidated$ = this._reinsuranceValidated.asObservable();
  get reinsuranceValidated(): boolean { return this._reinsuranceValidated.getValue(); }
  set reinsuranceValidated(value: boolean) { 
     this._status.isReinsuranceValidated = value;
    this.updateEndorsementStatus(this._status).toPromise();
    this._reinsuranceValidated.next(value); 
  }

  constructor(private http: HttpClient, private config: ConfigService) { }

  getEndorsementStatus(policyId: number, endorsementNo: number): Observable<EndorsementStatusData> {
    return this.http.get<EndorsementStatusData>(this.config.apiBaseUrl + 'api/policies/' + policyId + '/endorsements/' + endorsementNo + '/status')
      .pipe(
        tap(data => {
          this._status = data;
          this._policyInfoValidated.next(data?.isPolicyValidated ?? false);
          this._coverageValidated.next(data?.isCoverageValidated ?? false);
          this._reinsuranceValidated.next(data?.isReinsuranceValidated ?? false);
          this.status.next(data?.invoiceStatusDescription ?? "");
          const editFlag = data.invoiceStatus == null ? true : (data.invoiceStatus == "N" || (data.invoiceStatus == "T" && data.proFlag == 0));
          this.readonly.next(!editFlag);
        })
      );
  }

  refresh(): void {
    this.getEndorsementStatus(this._status.policyId,this._status.endorsementNumber).toPromise();
  }

  private updateEndorsementStatus(invoice: EndorsementStatusData): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/status/', invoice)
    .pipe(
      catchError(() => {
        return of(false);
      })
    );
  }

}

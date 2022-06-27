import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { EndorsementStatusData } from '../../models/policy';

@Injectable({
  providedIn: 'root'
})
export class EndorsementStatusService {
  private _status!: EndorsementStatusData;
  authSub: Subscription;
  canEditPolicy = false;
  private _endorsementNumber: number | null = null;

  status = new BehaviorSubject<string>('');
  canEditEndorsement = new BehaviorSubject<boolean>(false);

  private _policyInfoValidated = new BehaviorSubject<boolean>(false);
  policyInfoValidated$ = this._policyInfoValidated.asObservable();
  get policyInfoValidated(): boolean { return this._policyInfoValidated.getValue(); }
  set policyInfoValidated(value: boolean) {
    if (this.canEditPolicy && this._status.isPolicyValidated != value) {
      this._status.isPolicyValidated = value;
      this._policyInfoValidated.next(value);
      this.updateEndorsementStatus(this._status).subscribe();
    }
  }

  private _coverageValidated = new BehaviorSubject<boolean>(false);
  coverageValidated$ = this._coverageValidated.asObservable();
  get coverageValidated(): boolean { return this._coverageValidated.getValue(); }
  set coverageValidated(value: boolean) {
    if (this.canEditPolicy && this._status.isCoverageValidated != value) {
      this._status.isCoverageValidated = value;
      this._coverageValidated.next(value);
      this.updateEndorsementStatus(this._status).subscribe();
    }
  }

  private _reinsuranceValidated = new BehaviorSubject<boolean>(false);
  reinsuranceValidated$ = this._reinsuranceValidated.asObservable();
  get reinsuranceValidated(): boolean { return this._reinsuranceValidated.getValue(); }
  set reinsuranceValidated(value: boolean) {
    if (this.canEditPolicy && this._status.isReinsuranceValidated != value) {
      this._status.isReinsuranceValidated = value;
      this._reinsuranceValidated.next(value);
      this.updateEndorsementStatus(this._status).subscribe();
    }
  }

  private _isRewrite = new BehaviorSubject<boolean>(false);
  _isRewrite$ = this._isRewrite.asObservable();
  get isRewrite(): boolean { return this._isRewrite.getValue();
  }

  private _invoiced = new BehaviorSubject<boolean>(false);
  invoiced$ = this._invoiced.asObservable();
  get invoiced(): boolean { return this._invoiced.getValue(); }

  private _directQuote = new BehaviorSubject<boolean>(false);
  directQuote$ = this._directQuote.asObservable();
  get directQuote(): boolean { return this._directQuote.getValue(); }

  private _endorsementReason = new BehaviorSubject<string>('');
  endorsementReason$ = this._endorsementReason.asObservable();
  get endorsementReason(): string { return this._endorsementReason.getValue(); }

  private _invoiceSaving = new BehaviorSubject<boolean>(false);
  invoiceSaving$ = this._invoiceSaving.asObservable();
  get invoiceSaving(): boolean { return this._invoiceSaving.getValue(); }
  set invoiceSaving(value: boolean) {
    this._invoiceSaving.next(value);
  }

  private _refreshInvoice = new Subject<void>();
  refreshInvoice$ = this._refreshInvoice.asObservable();
  public refreshInvoice() {
    this._refreshInvoice.next();
  }
  endorsementNumber$: BehaviorSubject<number | null> = new BehaviorSubject(this._endorsementNumber);
  get endorsementNumber(): number | null { return this._endorsementNumber; }
  set endorsementNumber(value: number | null) {
    this._endorsementNumber = value;
    this.endorsementNumber$.next(this._endorsementNumber);
  }

  isValidated(): boolean {
    return this.policyInfoValidated && this.reinsuranceValidated && this.coverageValidated;
  }

  constructor(private userAuth: UserAuth, private http: HttpClient, private config: ConfigService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  getEndorsementStatus(policyId: number, endorsementNo: number): Observable<EndorsementStatusData> {
    return this.http.get<EndorsementStatusData>(this.config.apiBaseUrl + 'api/policies/' + policyId + '/endorsements/' + endorsementNo + '/status')
      .pipe(
        tap(data => {
          this._status = data;
          this._policyInfoValidated.next(data?.isPolicyValidated ?? false);
          this._coverageValidated.next(data?.isCoverageValidated ?? false);
          this._reinsuranceValidated.next(data?.isReinsuranceValidated ?? false);
          this._directQuote.next(data?.isDirectQuote ?? false);
          this._endorsementReason.next(data?.endorsementReason ?? '');
          this._isRewrite.next(data?.isRewrite ?? false);
          this._invoiced.next(data?.isInvoiced ?? false);
          this.status.next(data?.invoiceStatusDescription ?? '');
          const editFlag = data.invoiceStatus == null ? true : (data.invoiceStatus == 'N' || (data.invoiceStatus == 'T' && data.proFlag == 0));
          this.canEditEndorsement.next(editFlag);
        })
      );
  }

  async UpdateInvoiced(value: boolean): Promise<void> {
    this._status.isInvoiced = value;
    const results$ = this.updateEndorsementStatus(this._status);
    return await lastValueFrom(results$).then(
      (result) => {
        if (result) {
          this._invoiced.next(value);
        }
      }
    );
  }

  async refresh(): Promise<void> {
    const results$ = this.getEndorsementStatus(this._status.policyId, this._status.endorsementNumber);
    await lastValueFrom(results$);
  }

  private updateEndorsementStatus(invoice: EndorsementStatusData): Observable<boolean> {
    return this.http.put<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/status/', invoice)
      .pipe(
        catchError(() => {
          return of(false);
        })
      );
  }

  public addEndorsementStatus(endorsementInfo: EndorsementStatusData): Observable<boolean> {
    return this.http.post<boolean>(this.config.apiBaseUrl + 'api/policies/endorsements/status/', endorsementInfo)
      .pipe(
        catchError(() => {
          return of(false);
        })
      );
  }
}

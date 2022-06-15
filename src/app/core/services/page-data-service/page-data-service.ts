import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Insured } from 'src/app/features/insured/models/insured';
import { PolicyData } from 'src/app/features/policy/models/policy';
import { SubmissionClass } from 'src/app/features/submission/classes/SubmissionClass';

@Injectable()
export class PageDataService {
  private _insuredData: Insured | null = null;
  private _submissionData: SubmissionClass | null = null;
  private _policyData: PolicyData | null = null;
  private _noData = true;

  insuredData$: BehaviorSubject<Insured | null> = new BehaviorSubject(this._insuredData);
  submissionData$: BehaviorSubject<SubmissionClass | null> = new BehaviorSubject(this._submissionData);
  policyData$: BehaviorSubject<PolicyData | null> = new BehaviorSubject(this._policyData);
  noData$: BehaviorSubject<boolean> = new BehaviorSubject(this._noData);

  get insuredData(): Insured | null {
    return this._insuredData;
  }

  set insuredData(val: Insured | null) {
    this._insuredData = val;
    this.insuredData$.next(this._insuredData);
    if (val != null) {
      this.isNoData = false;
    }
  }
  get submissionData(): SubmissionClass | null {
    return this._submissionData;
  }

  set submissionData(val: SubmissionClass | null) {
    this._submissionData = val;
    this.submissionData$.next(this._submissionData);
    if (val != null) {
      this.isNoData = true;
    }
  }
  get policyData(): PolicyData | null {
    return this._policyData;
  }

  set policyData(val: PolicyData | null) {
    this._policyData = val;
    this.policyData$.next(this._policyData);
    if (val != null) {
      this.isNoData = false;
    }
  }
  get isNoData(): boolean {
    return this._noData;
  }

  set isNoData(val: boolean) {
    this._noData = val;
    setTimeout(() => this.noData$.next(this._noData),0);
  }
}

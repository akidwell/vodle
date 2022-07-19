import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InsuredClass } from 'src/app/features/insured/classes/insured-class';
import { AccountInformation, PolicyInformation } from 'src/app/features/policy/models/policy';
import { DepartmentClass } from 'src/app/features/quote/classes/department-class';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { SubmissionClass } from 'src/app/features/submission/classes/SubmissionClass';
import { HistoricRoute } from '../../models/historic-route';

@Injectable()
export class PageDataService {
  private _insuredData: InsuredClass | null = null;
  private _submissionData: SubmissionClass | null = null;
  private _quoteData: DepartmentClass | null = null;
  private _policyData: PolicyInformation | null = null;
  private _accountInfo: AccountInformation | null = null;
  private _lastSubmission: HistoricRoute | null = null;
  private _selectedProgram: ProgramClass | null = null;
  private _resetLastSubmission = true;

  private _noData = true;

  insuredData$: BehaviorSubject<InsuredClass | null> = new BehaviorSubject(this._insuredData);
  submissionData$: BehaviorSubject<SubmissionClass | null> = new BehaviorSubject(
    this._submissionData
  );
  quoteData$: BehaviorSubject<DepartmentClass | null> = new BehaviorSubject(this._quoteData);
  selectedProgram$: BehaviorSubject<ProgramClass | null> = new BehaviorSubject(this._selectedProgram);
  policyData$: BehaviorSubject<PolicyInformation | null> = new BehaviorSubject(this._policyData);
  accountInfo$: BehaviorSubject<AccountInformation | null> = new BehaviorSubject(this._accountInfo);
  noData$: BehaviorSubject<boolean> = new BehaviorSubject(this._noData);

  get insuredData(): InsuredClass | null {
    return this._insuredData;
  }

  set insuredData(val: InsuredClass | null) {
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

  get quoteData(): DepartmentClass | null {
    return this._quoteData;
  }

  set quoteData(val: DepartmentClass | null) {
    this._quoteData = val;
    this.quoteData$.next(this._quoteData);
    if (val != null) {
      this.isNoData = false;
    }
  }
  get policyData(): PolicyInformation | null {
    return this._policyData;
  }

  set policyData(val: PolicyInformation | null) {
    this._policyData = val;
    this.policyData$.next(this._policyData);
    if (val != null) {
      this.isNoData = false;
    }
  }
  get accountInfo(): AccountInformation | null {
    return this._accountInfo;
  }

  set accountInfo(val: AccountInformation | null) {
    this._accountInfo = val;
    this.accountInfo$.next(this._accountInfo);
  }
  get lastSubmission(): HistoricRoute | null {
    return this._lastSubmission;
  }
  set lastSubmission(val: HistoricRoute | null) {
    if (this._resetLastSubmission) {
      this._lastSubmission = val;
    } else {
      this._resetLastSubmission = true;
    }
    if (val) {
      this._resetLastSubmission = false;
    }
  }

  get isNoData(): boolean {
    return this._noData;
  }

  set isNoData(val: boolean) {
    this._noData = val;
    setTimeout(() => this.noData$.next(this._noData), 0);
  }

  getProgramWithQuote(quoteId: number) {
    let activeProgram = null;
    if (this._quoteData) {
      this._quoteData.programMappings.forEach((program) => {
        if (program && program.quoteData && program.quoteData.quoteId == quoteId) {
          activeProgram = program;
        }
      });
    }
    this.selectedProgram = activeProgram;
  }
  set selectedProgram(program: ProgramClass | null) {
    this._selectedProgram = program;
    this.selectedProgram$.next(this._selectedProgram);
  }
  get selectedProgram(): ProgramClass | null {
    return this._selectedProgram;
  }
}

import { DatePipe } from '@angular/common';
import { Quote } from '../models/quote';
import { QuoteBuildingClass } from './quote-building-class';
import { QuoteCoverageClass } from './quote-coverage-class';
import { QuoteDeductibleClass } from './quote-deductible-class';
import { QuoteLocationClass } from './quote-location-class';
import { QuoteMortgageeClass } from './quote-mortgagee-class';

export class QuoteClass implements Quote {
  private _submissionNumber: number | null = null;
  private _quoteId: number | null = null;
  private _cuspNumber: number | null = null;
  private _quoteNo: number | null = null;
  private _sequenceNumber: number | null = null;

  quoteBuilding: QuoteBuildingClass[] = [];
  quoteCoverage: QuoteCoverageClass[] = [];
  quoteDeductible: QuoteDeductibleClass[] = [];
  quoteMortgagee: QuoteMortgageeClass[] = [];
  quoteLocation: QuoteLocationClass[] = [];

  private _isDirty = false;
  isNew = false;
  invalidList: string[] = [];

  get submissionNumber(): number | null{
    return this._submissionNumber;
  }
  set submissionNumber(value: number | null) {
    this._submissionNumber = value;
    this._isDirty = true;
  }

  get sequenceNumber(): number | null{
    return this._sequenceNumber;
  }
  set sequenceNumber(value: number | null) {
    this._sequenceNumber = value;
    this._isDirty = true;
  }


  get quoteId(): number | null {
    return this._quoteId;
  }
  set quoteId(value: number | null){
    this._quoteId = value;
    this._isDirty = true;
  }

  get cuspNumber(): number | null{
    return this._cuspNumber;
  }

  set cuspNumber(value: number | null){
    this._cuspNumber = value;
    this._isDirty = true;
  }

  get quoteNo(): number | null{
    return this._quoteNo;
  }

  set quoteNo(value: number | null){
    this._quoteNo = value;
    this._isDirty = true;
  }

  get isDirty(): boolean {
    return this._isDirty ;
  }
  get isValid(): boolean {
    // let valid = true;
    // valid = this.validate(valid);
    return true;
  }

  private datepipe = new DatePipe('en-US');


  constructor(quote?: Quote) {
    this._submissionNumber = quote?.submissionNumber || null;
    this._quoteId = quote?.quoteId || null;
    this._cuspNumber = quote?.cuspNumber || null;
    this._sequenceNumber = quote?.sequenceNumber || null;
    this._quoteNo = quote?.quoteNo || null;
    this.setReadonlyFields();
    this.setRequiredFields();
  }

  markClean() {
    this._isDirty = false;
  }
  markDirty() {
    this._isDirty = true;
  }
  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }

  // validate(valid: boolean): boolean {
  //   this.invalidList = [];
  //   if (!this.validateName()) {
  //     valid = false;
  //   }
  //   return valid;
  // }

  // validateName(): boolean {
  //   let valid = true;
  //   if (!this.name) {
  //     valid = false;
  //     this.invalidList.push('First Named Insured is required.');
  //   }
  //   return valid;
  // }


  toJSON() {
    return {
      submissionNumber: this.submissionNumber,
      quoteId: this.quoteId,
      cuspNumber: this.cuspNumber,
    };
  }
}

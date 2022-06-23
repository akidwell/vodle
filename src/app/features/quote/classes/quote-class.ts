import { DatePipe } from '@angular/common';
import { Quote } from '../models/quote';

export class QuoteClass implements Quote {
  private _submissionNumber: number | null = null;
  private _quoteId: number | null = null;
  private _cuspNumber: number | null = null;
  private _quoteNumber: number | null = null;

  private _isDirty = false;
  isNew = false;

  // nameRequired = true;
  // street1Required = true;
  // street2Required = false;

  // nameReadonly = false;
  // isAddressOverrideReadonly = false;
  // formerName1Readonly = false;

  invalidList: string[] = [];

  get submissionNumber(): number | null{
    return this._submissionNumber;
  }
  set submissionNumber(value: number | null) {
    this._submissionNumber = value;
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

  get quoteNumber(): number | null{
    return this._quoteNumber;
  }

  set quoteNumber(value: number | null){
    this._quoteNumber = value;
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
    this._quoteNumber = quote?.quoteNumber || null;
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

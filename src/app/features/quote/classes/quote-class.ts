import { DatePipe } from '@angular/common';
import { Moment } from 'moment';
import { SubmissionClass } from '../../submission/classes/SubmissionClass';
import { Quote } from '../models/quote';
import { ProgramClass } from './program-class';

export class QuoteClass implements Quote {

  submissionNumber = 0;
  quoteId = 0;
  cuspNumber = 0;
  quoteNumber = 0;
  sequenceNumber = 0;
  effectiveDate: Date | Moment | null = null;
  expirationDate: Date | Moment | null = null;
  status = 0;
  coverageCode = 0;
  claimsMadeOrOccurrence = '';
  admittedStatus = '';
  policyNumber: string | number = '--';
  carrierCode = '';
  pacCode = '';
  mappingError = false;
  submission!: SubmissionClass;

  private _isDirty = false;
  isNew = false;

  // nameRequired = true;
  // street1Required = true;
  // street2Required = false;

  // nameReadonly = false;
  // isAddressOverrideReadonly = false;
  // formerName1Readonly = false;

  invalidList: string[] = [];

  get isDirty(): boolean {
    return this._isDirty ;
  }
  get isValid(): boolean {
    // let valid = true;
    // valid = this.validate(valid);
    return true;
  }

  private datepipe = new DatePipe('en-US');


  constructor(quote?: Quote, program?: ProgramClass) {
    if (quote) {
      this.existingInit(quote);
    } else if (program) {
      this.newInit(program);
    }
  }
  existingInit(quote: Quote) {
    this.submissionNumber = quote.submissionNumber || 0;
    this.quoteId = quote.quoteId || 0;
    this.cuspNumber = quote.cuspNumber || 0;
    this.sequenceNumber = quote.sequenceNumber || 0;
    this.quoteNumber = quote.quoteNumber || 1;
    this.claimsMadeOrOccurrence = quote.claimsMadeOrOccurrence || '';
    this.admittedStatus = quote.admittedStatus || '';
    this.effectiveDate = quote.effectiveDate || null;
    this.expirationDate = quote.expirationDate || null;
    this.status = quote.status || 0;
    this.coverageCode = quote.coverageCode || 0;
    this.carrierCode = quote.carrierCode || '';
    this.pacCode = quote.pacCode || '';
    this.submission = new SubmissionClass(quote.submission);
    this.setReadonlyFields();
    this.setRequiredFields();
    console.log(this.submission);
  }
  newInit(program: ProgramClass) {
    //if first quote on group attach to existing submission
    //else duplicate submission and attach to that
    //quote data will be tied to tblCUSP_Quotes
    //need to add record to tbl_SubmissionGroupQuotes
    console.log(program);
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

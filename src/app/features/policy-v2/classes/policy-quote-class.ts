
import { QuoteData } from '../../policy/models/policy';
import { ChildBaseClass } from './base/child-base-class';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';

export class PolicyQuoteClass extends ChildBaseClass implements QuoteData {


  constructor(quote?: QuoteData) {
    super();
    if (quote) {
      this.existingInit(quote);
    }
    //this.setWarnings();
  }
  pacCode!: string;
  quoteNumber!: string;
  carrierCode!: string;
  coverageCode!: string;
  claimsMadeOrOccurrence!: string;
  retroDate!: Date | null;
  programId= 0;

  private _creditDays = '';
  get creditDays() : string {
    return this._creditDays;
  }
  set creditDays(value: string) {
    this._creditDays = value;
    this.markDirty();
  }


  existingInit(quote: QuoteData) {
    console.log(quote);
    this.pacCode = quote.pacCode;
    this.quoteNumber = quote.quoteNumber;
    this.carrierCode = quote.carrierCode;
    this._creditDays = quote.creditDays;
    this.claimsMadeOrOccurrence = quote.claimsMadeOrOccurrence;
    this.retroDate = quote.retroDate;
    this.coverageCode = quote.coverageCode;
    this.programId = quote.programId;
  }

  validateObject(): ErrorMessage[]{
    console.log('validate  policy');
    //on load or if dirty validate this
    console.log('BBBBBBBBBBB' + this);
    console.log('AAAAAAAAAAA ' + this.isDirty);
    if (this.isDirty){
      //TODO: class based validation checks
      this.errorMessagesList = [];
      this.canBeSaved = true;
      this.isValid = true;
      console.log(this.pacCode);
      if(this.pacCode == ''){
        this.createErrorMessage('PacCode is required.');
      }
    }
    return this.errorMessagesList;
  }

  onGuidNewMatch(T: ChildBaseClass): void {
  }
  onGuidUpdateMatch(T: ChildBaseClass): void {
  }

  toJSON(): QuoteData{
    return{
      creditDays: this.creditDays,
      carrierCode: this.carrierCode,
      retroDate : this.retroDate,
      pacCode: this.pacCode,
      quoteNumber : this.quoteNumber,
      coverageCode: this.coverageCode,
      claimsMadeOrOccurrence: this.claimsMadeOrOccurrence,
      programId: this.programId
    };
  }
}

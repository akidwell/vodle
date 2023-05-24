
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
  creditDays!: string;
  claimsMadeOrOccurrence!: string;
  retroDate!: Date | null;

  existingInit(quote: QuoteData) {
    this.pacCode = quote.pacCode;
    this.quoteNumber = quote.quoteNumber;
    this.carrierCode = quote.carrierCode;
    this.creditDays = quote.creditDays;
    this.claimsMadeOrOccurrence = quote.claimsMadeOrOccurrence;
    this.retroDate = quote.retroDate;
    this.coverageCode = quote.coverageCode;
  }

  validate(): ErrorMessage[]{
    console.log('validate  policy');
    //on load or if dirty validate this
    console.log('BBBBBBBBBBB' + this);
    console.log('AAAAAAAAAAA ' + this.isDirty);
    if (this.isDirty){
      //TODO: class based validation checks
      this.errorMessages = [];
      this.canBeSaved = true;
      this.isValid = true;
      console.log(this.pacCode);
      if(this.pacCode == ''){
        this.createErrorMessage('PacCode is required.');
      }
    }
    return this.errorMessages;
  }

  onGuidNewMatch(T: ChildBaseClass): void {
    throw new Error('Method not implemented.');
  }
  onGuidUpdateMatch(T: ChildBaseClass): void {
    throw new Error('Method not implemented.');
  }
}

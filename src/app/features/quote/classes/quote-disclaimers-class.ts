
import { DisclaimersClass } from 'src/app/shared/classes/disclaimers-class';
import { QuoteDisclaimers } from '../models/quote-disclaimers';

export class QuoteDisclaimersClass extends DisclaimersClass {
  quoteId!: number;

  classValidation() {
    this.invalidList = [];
    this.canBeSaved = true;
    this.errorMessages = this.invalidList;
  }

  toJSON(): QuoteDisclaimers {
    return {
      isIncluded: this.isIncluded,
      quoteId: this.quoteId,
      disclaimerCode: this.disclaimerCode,
      sortSequence: this.sortSequence,
      ysnDefault: this.ysnDefault,
      ysnAutoSelect: this.ysnAutoSelect,
      ysnDeletable: this.ysnDeletable,
      disclaimerDesc: this.disclaimerDesc,
      description: this.description,
      sequence: this.sequence,
      isUserDefined: this.isUserDefined,
      document: this.document
    };
  }
}
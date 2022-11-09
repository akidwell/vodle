
import { GeneralRemarksClass } from 'src/app/shared/classes/general-remarks-class';
import { QuoteGeneralRemarks } from '../models/quote-general-remarks';

export class QuoteGeneralRemarksClass extends GeneralRemarksClass {
  quoteId!: number;
  isNew!: boolean;

  classValidation() {
    this.invalidList = [];
    this.canBeSaved = true;
    this.errorMessages = this.invalidList;
  }

  toJSON(): QuoteGeneralRemarks {
    return {
      quoteId: this.quoteId,
      remarkId: this.remarkId,
      sortSequence: this.sortSequence,
      remark: this.remark,
    };
  }
}

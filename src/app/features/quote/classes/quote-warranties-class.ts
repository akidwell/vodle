import { WarrantiesClass } from 'src/app/shared/classes/warranties-class';
import { QuoteWarranties } from '../models/quote-warranties';


export class QuoteWarrantiesClass extends WarrantiesClass {
  quoteId!: number;

  classValidation() {
    this.invalidList = [];
    this.canBeSaved = true;
    this.errorMessages = this.invalidList;
  }

  toJSON(): QuoteWarranties {
    return {
      isIncluded: this.isIncluded,
      quoteId: this.quoteId,
      warrantyCode: this.warrantyCode,
      sortSequence: this.sortSequence,
      ysnDefault: this.ysnDefault,
      ysnAutoSelect: this.ysnAutoSelect,
      ysnDeletable: this.ysnDeletable,
      description: this.description,
      sequence: this.sequence,
      isUserDefined: this.isUserDefined,
      document: this.document,
      sectionHeader: this.sectionHeader,
      mainHeader: this.mainHeader,
      warrantyOf: this.warrantyOf
    };
  }
}

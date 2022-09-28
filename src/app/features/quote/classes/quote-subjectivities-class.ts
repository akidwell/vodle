import { SubjectivitiesClass } from 'src/app/shared/classes/subjectivities-class';
import { QuoteSubjectivities } from '../models/quote-subjectivities';


export class QuoteSubjectivitiesClass extends SubjectivitiesClass {
  quoteId = 0;

  classValidation() {
    this.invalidList = [];
    this.canBeSaved = true;
    // if (!this.validateAmount()) {
    //   valid = false;
    // }

    this.errorMessages = this.invalidList;
    // this._canBeSaved = true;
    // this._isValid = true;
  }

  toJSON(): QuoteSubjectivities {
    return {
      isIncluded: this.isIncluded,
      quoteId: this.quoteId,
      subjectivityCode: this.subjectivityCode,
      sortSequence: this.sortSequence,
      ysnDefault: this.ysnDefault,
      ysnAutoSelect: this.ysnAutoSelect,
      ysnDeletable: this.ysnDeletable,
      subjectivityDesc: this.subjectivityDesc,
      description: this.description,
      sequence: this.sequence,
      isUserDefined: this.isUserDefined
    };
  }
}
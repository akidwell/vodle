import { SubjectivitiesClass } from 'src/app/shared/classes/subjectivities-class';
import { QuoteSubjectivities } from '../models/quote-subjectivities';


export class QuoteSubjectivitiesClass extends SubjectivitiesClass {
  quoteId!: number;

  classValidation() {
    this.invalidList = [];
    this.canBeSaved = true;
    this.errorMessages = this.invalidList;
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
      isUserDefined: this.isUserDefined,
      document: this.document
    };
  }
}
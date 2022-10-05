import { PolicyFormClass } from 'src/app/shared/classes/policy-form-class';
import { QuotePolicyForm } from '../models/quote-policy-form';


export class QuotePolicyFormClass extends PolicyFormClass {
  quoteId = 0;

  classValidation() {
    this.invalidList = [];
    this.canBeSaved = true;
    this.isValid = true;
    this.errorMessages = this.invalidList;
  }

  toJSON(): QuotePolicyForm {
    return {
      quoteId: this.quoteId,
      isIncluded: this.isIncluded,
      formName: this.formName,
      formTitle: this.formTitle,
      isMandatory: this.isMandatory,
      specimenLink: this.specimenLink,
      hasSpecialNote: this.hasSpecialNote,
      isVariable: this.isVariable,
      formCategory: this.formCategory,
      categorySequence: this.categorySequence,
      sortSequence: this.sortSequence,
      formIndex: this.formIndex,
      allowMultiples: this.allowMultiples,
      formData: this.formData
    };
  }
}
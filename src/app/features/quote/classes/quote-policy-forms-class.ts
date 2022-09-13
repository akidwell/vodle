import { PolicyFormClass } from 'src/app/shared/classes/policy-form-class';
import { QuotePolicyForm } from '../models/quote-policy-form';


export class QuotePolicyFormClass extends PolicyFormClass {
  _quoteId = 0;

  get quoteId() : number {
    return this._quoteId;
  }
  set quoteId(value: number) {
    this._quoteId = value;
    //this.markDirty();
  }

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
      sortSequence: this.sortSequence,
      formIndex: this.formIndex,
    };
  }
}
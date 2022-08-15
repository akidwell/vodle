import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidation } from '../models/quote-validation';

export class QuoteValidationClass implements QuoteValidation {
  isValid = false;
  isDirty = false;
  canBeSaved = false;
  errorMessages: string[] = [];
  isEmpty = false;
  tabName: QuoteValidationTabNameEnum | null = null;
  validationType: QuoteValidationTypeEnum = QuoteValidationTypeEnum.Quote;

  constructor(type: QuoteValidationTypeEnum, tabName: QuoteValidationTabNameEnum | null){
    this.isValid = true;
    this.isDirty = false;
    this.canBeSaved = true;
    this.errorMessages = [];
    this.isEmpty = false;
    this.validationType = type;
    this.tabName = tabName;
  }
  validateChildrenAsStandalone(childGroup: QuoteValidation[]) {
    this.isEmpty = childGroup.length == 0;
    this.isDirty = childGroup.map(x => x.isDirty).includes(true);
    this.canBeSaved = !childGroup.map(x => x.canBeSaved).includes(false);
    this.isValid = !childGroup.map(x => x.isValid).includes(false);
    this.errorMessages = childGroup.flatMap(x => x.errorMessages);
  }
  validateChildrenAndMerge(childGroup: QuoteValidation[]) {
    this.isEmpty = childGroup.length == 0;
    this.isDirty = this.isDirty || childGroup.map(x => x.isDirty).includes(true);
    this.canBeSaved = this.canBeSaved && !childGroup.map(x => x.canBeSaved).includes(false);
    this.isValid = this.isValid && !childGroup.map(x => x.isValid).includes(false);
    this.errorMessages = this.errorMessages.concat(childGroup.flatMap(x => x.errorMessages));
  }
  addValidationToChildGroup(childGroup: QuoteValidationClass[]) {
    childGroup.push(this);
  }
  mapValues(item: QuoteValidation){
    this.canBeSaved = item.canBeSaved;
    this.isDirty = item.isDirty;
    this.isEmpty = false;
    this.isValid = item.isValid;
    this.errorMessages = item.errorMessages;
  }
  resetValidation() {
    this.isDirty = false;
    this.isEmpty = false;
    this.isValid = true;
    this.errorMessages = [];
  }
}

import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { Validation } from '../interfaces/validation';
import { DepartmentClass } from 'src/app/features/quote/classes/department-class';
import { PolicyValidationTabNameEnum } from 'src/app/core/enums/policy-validation-tab-name-enum';
import { ErrorMessage } from '../interfaces/errorMessage';

export abstract class ValidationClass implements Validation {
  isValid = false;
  isDirty = false;
  canBeSaved = false;
  errorMessages: string[] = [];
  errorMessagesList: ErrorMessage[] = [];
  markParentDirty?: () => void;
  isEmpty = false;
  tabName: QuoteValidationTabNameEnum | PolicyValidationTabNameEnum | null = null;
  validationType: ValidationTypeEnum = ValidationTypeEnum.Quote;

  constructor(type: ValidationTypeEnum, tabName: QuoteValidationTabNameEnum | PolicyValidationTabNameEnum | null){
    this.isValid = true;
    this.isDirty = false;
    this.canBeSaved = true;
    this.errorMessages = [];
    this.isEmpty = false;
    this.validationType = type;
    this.tabName = tabName;
  }
  //used to validate an array of objects implementing QuoteValidation
  validateChildrenAsStandalone(childGroup: Validation[]) {
    this.isEmpty = childGroup.length == 0;
    this.isDirty = childGroup.map(x => x.validationResults?.isDirty).includes(true);
    this.canBeSaved = !childGroup.map(x => x.validationResults?.canBeSaved).includes(false);
    this.isValid = !childGroup.map(x => x.validationResults?.isValid).includes(false);
    this.errorMessages = childGroup.flatMap(x => x.validationResults?.errorMessages || []);
  }
  //used to validate an array of objects implementing QuoteValidation and merging with the parent validation
  validateChildrenAndMerge(childGroup: Validation[]) {
    this.isEmpty = childGroup.length == 0;
    if (!this.isEmpty) {
      this.isDirty = this.isDirty || childGroup.map(x => x.validationResults?.isDirty).includes(true);
      this.canBeSaved = this.canBeSaved && !childGroup.map(x => x.validationResults?.canBeSaved).includes(false);
      this.isValid = this.isValid && !childGroup.map(x => x.validationResults?.isValid).includes(false);
      this.errorMessages = this.errorMessages.concat(childGroup.flatMap(x => x.validationResults?.errorMessages || []));
    }
  }
  //used to validate an array of QuoteValidations
  validateChildValidations(childGroup: Validation[]) {
    this.isEmpty = childGroup.length == 0;
    if (!this.isEmpty) {
      this.isDirty = this.isDirty || childGroup.map(x => x.isDirty).includes(true);
      this.canBeSaved = this.canBeSaved && !childGroup.map(x => x.canBeSaved).includes(false);
      this.isValid = this.isValid && !childGroup.map(x => x.isValid).includes(false);
      this.errorMessages = this.errorMessages.concat(childGroup.flatMap(x => x.errorMessages || []));
    }
  }
  addValidationToChildGroup(childGroup: ValidationClass[]) {
    childGroup.push(this);
  }
  mapValues(item: Validation){
    this.canBeSaved = item.canBeSaved;
    this.isDirty = item.isDirty;
    this.isEmpty = false;
    this.isValid = item.isValid;
    this.errorMessages = item.errorMessages || [];
  }
  resetValidation() {
    this.isDirty = false;
    this.isEmpty = false;
    this.isValid = true;
    this.errorMessages = [];
  }

  ////////
  ///Below is a recursive validation checker
  ///classes aren't clean enough to use this optimally but could be used in the future
  ////////
  // departmentLevelValidation(object: DepartmentClass): boolean {
  //   let userCanSave = false;
  //   object.programMappings.forEach(program => {
  //     if (!this.canBeSaved) {
  //       return;
  //     }
  //     if (program.quoteData) {
  //       userCanSave = this.fullQuoteValidation(program.quoteData);
  //     }
  //   });
  //   console.log('userCanSave: ', userCanSave, 'obj: ', object);
  //   return userCanSave;
  // }
  // fullValidation<T extends Validation>(object: T): boolean {
  //   const isDirty = this.isDirty;
  //   const canBeSaved = this.canBeSaved;
  //   let userCanSave = (isDirty && canBeSaved);
  //   Object.keys(object).forEach(key => {
  //     const property = object[key as keyof T];
  //     if (!canBeSaved) {
  //       return;
  //     }

  //     if (Array.isArray(property) && property.length > 0) {
  //       if (this.checkIfTypeOfValidationArray(property)) {
  //         this.isDirty = (property as Array<Validation>).some(x=> x.isDirty === true);
  //         this.canBeSaved = !(property as Array<Validation>).some(x=> x.canBeSaved === false);
  //         (property as Array<Validation>).forEach(object => {
  //           //userCanSave = this.fullQuoteValidation(object as Validation);
  //         });
  //       }
  //     } else if (!Array.isArray(property) && this.checkIfTypeOfValidation(property)) {
  //       this.isDirty = this.isDirty ? this.isDirty : (property as Validation).isDirty;
  //       this.canBeSaved = this.canBeSaved ? (property as Validation).canBeSaved : this.canBeSaved;
  //       if (!canBeSaved) {
  //         return;
  //       }
  //       userCanSave = this.fullQuoteValidation(property as Validation);
  //     }
  //     userCanSave = userCanSave ? (isDirty && canBeSaved) : userCanSave;

  //     //return userCanSave;
  //   });
  //   //Object.keys(object).map(key => object[key as keyof T])
  //   // for (const key in object) {
  //   // }

  //   return userCanSave;
  // }
  // private checkIfTypeOfValidationArray<T>(array: Array<T>):boolean {
  //   let typeCheck = false;
  //   const object = array[0];
  //   if (object as Validation && (object as Validation).validate) {
  //     typeCheck = this.checkIfTypeOfValidation(object);
  //   }
  //   return typeCheck;
  // }
  // private checkIfTypeOfValidation<T>(object: T):boolean {
  //   let typeCheck = false;
  //   if (object as Validation && (object as Validation).validate) {
  //     typeCheck = true;
  //   }
  //   return typeCheck;
  // }
}

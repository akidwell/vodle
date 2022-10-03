import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationClass } from 'src/app/features/quote/classes/quote-validation-class';
import { QuoteAfterSave } from 'src/app/features/quote/models/quote-after-save';
import { Subjectivities } from '../interfaces/subjectivities';
import { Validation } from '../interfaces/validation';

export abstract class SubjectivitiesClass implements Subjectivities, Validation, QuoteAfterSave{
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _isIncluded = false;
  private _validationResults: QuoteValidationClass;

  invalidList: string[] = [];
  sequence: number | null = null;
  isUserDefined: boolean | null = null;
  subjectivityCode: number | null = null;
  sortSequence: number | null = null;
  ysnDefault: boolean | null = null;
  ysnAutoSelect: boolean | null = null;
  ysnDeletable: boolean | null = null;
  subjectivityDesc: string | null = null;
  description: string | null = null;
  document: string | null = null;

  constructor(subjectivities?: Subjectivities){
    if (subjectivities) {
      this.existingInit(subjectivities);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.FormsList);
    this.validate();
  }

  get isIncluded(): boolean {
    return this._isIncluded;
  }
  set isIncluded(value: boolean) {
    this._isDirty = true;
    this._isIncluded = value;
  }

  get validationResults(): QuoteValidationClass {
    return this._validationResults;
  }
  get canBeSaved(): boolean {
    return this._canBeSaved;
  }
  set canBeSaved(value: boolean) {
    this._canBeSaved = value;
  }

  get isDirty() : boolean {
    return this._isDirty;
  }
  set isDirty(value: boolean) {
    this._isDirty = value;
  }

  get isValid(): boolean {
    return this._isValid;
  }
  set isValid(value: boolean){
    this._isValid = value;
  }

  get errorMessages(): string[] {
    return this._errorMessages;
  }
  set errorMessages(value: string[]){
    this._errorMessages = value;
  }

  existingInit(sub: Subjectivities){
    this._isIncluded = sub.isIncluded;
    this.sequence = sub.sequence;
    this.isUserDefined = sub.isUserDefined;
    this.subjectivityCode = sub.subjectivityCode;
    this.sortSequence= sub.sortSequence;
    this.ysnDefault = sub.ysnDefault;
    this.ysnAutoSelect= sub.ysnAutoSelect;
    this.ysnDeletable = sub.ysnDeletable;
    this.subjectivityDesc = sub.subjectivityDesc;
    this.description= sub.description;
    this.document = sub.document;
  }

  newInit() {
    this.ysnDefault = false;
    this.isDirty = true;
    this.isIncluded = true;
  }

  validate(){
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks
      this.classValidation();
      this._validateOnLoad = false;
      console.log(this._canBeSaved);
    }
    this._validationResults.resetValidation();
    this._validationResults.mapValues(this);
    return this._validationResults;
  }

    abstract classValidation(): void;

    markClean() {
      this._isDirty = false;
    }
    markStructureClean(): void {
      this.markClean();
    }
    markDirty() {
      this._isDirty = true;
    }
    abstract toJSON(): Subjectivities;
}
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { Validation } from 'src/app/shared/interfaces/validation';
import { QuoteAfterSave } from '../models/quote-after-save';
import { QuoteRate } from '../models/quote-rate';
import { QuoteValidationClass } from './quote-validation-class';

export class QuoteRateClass implements QuoteRate, Validation, QuoteAfterSave {
  quoteId: number | null = null;
  sequenceNo: number | null = 0;
  classCode: number | null = 0;
  invalidList: string[] = [];

  private _premiumRate: number | undefined;
  private _premium: number | undefined;
  private _rateBasis: number | undefined;
  private _isFlatRate: boolean | undefined;
  private _isValid = true;
  private _isDirty = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  get premiumRate() : number | undefined {
    return this._premiumRate;
  }
  set premiumRate(value: number | undefined) {
    this._premiumRate = value;
    this._isDirty = true;
  }
  get premium() : number | undefined {
    return this._premium;
  }
  set premium(value: number | undefined) {
    this._premium = value;
    this._isDirty = true;
  }
  get rateBasis() : number | undefined {
    return this._rateBasis;
  }
  set rateBasis(value: number | undefined) {
    this._rateBasis = value;
    this._isDirty = true;
  }
  get isFlatRate() : boolean | undefined {
    return this._isFlatRate;
  }
  set isFlatRate(value: boolean | undefined) {
    this._isFlatRate = value;
    this._isDirty = true;
  }
  get isDirty() : boolean {
    return this._isDirty;
  }
  get canBeSaved() : boolean {
    return this._canBeSaved;
  }
  get errorMessages(): string[] {
    return this._errorMessages;
  }
  get isValid(): boolean {
    //this._isValid = this.validate(valid);
    return this._isValid;
  }
  get validationResults(): QuoteValidationClass {
    return this._validationResults;
  }

  constructor(rate?: QuoteRate) {
    if (rate) {
      this.existingInit(rate);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(ValidationTypeEnum.Child, QuoteValidationTabNameEnum.CoveragePremium);
    this.validate();
  }
  validate(){
    if (this._validateOnLoad || this.isDirty){
      this.classValidation();
      this._validateOnLoad = false;
    }
    this._validationResults.resetValidation();
    this._validationResults.mapValues(this);
    return this._validationResults;
  }
  classValidation() {
    this.invalidList = [];
    this._canBeSaved = true;
    this._isValid = true;
    const amountValidation = this.validateAmount();
    if (amountValidation != null) {
      this._isValid = false;
      this.invalidList.push(amountValidation);
    }
    this._errorMessages = this.invalidList;
  }
  validateAmount(): string | null {
    if (this.premium === null) {
      return 'Premium is required';
    }
    if (this.premium == 0) {
      return 'Premium must be > 0';
    }
    return null;
  }
  existingInit(rate: QuoteRate) {
    this.quoteId = rate.quoteId;
    this.sequenceNo = rate.sequenceNo;
    this._premiumRate = rate.premiumRate;
    this._premium = rate.premium;
    this._rateBasis = rate.rateBasis;
    this._isFlatRate = rate.isFlatRate;

    this.setReadonlyFields();
    this.setRequiredFields();
  }

  newInit() {
    this._rateBasis = 100;
    this._isFlatRate = true;
  }

  markClean() {
    this._isDirty = false;
  }
  markStructureClean(): void {
    this.markClean();
  }
  markDirty() {
    this._isDirty = true;
  }
  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }

  toJSON(classCode: number | null) {
    return {
      quoteId: this.quoteId,
      sequenceNo: this.sequenceNo,
      rateBasis: this.rateBasis,
      isFlatRate: this.isFlatRate,
      premiumRate: this.premiumRate,
      premium: this.premium,
      classCode: classCode
    };
  }
}

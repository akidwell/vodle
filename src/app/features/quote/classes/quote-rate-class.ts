import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteRate } from '../models/quote-rate';
import { QuoteValidation } from '../models/quote-validation';
import { QuoteValidationClass } from './quote-validation-class';

export class QuoteRateClass implements QuoteRate, QuoteValidation {
  quoteId: number | null = null;
  sequenceNo: number | null = 0;

  private _premiumRate: number | null = null;
  private _premium: number | null = null;
  private _rateBasis: number | null = null;
  private _isFlatRate: boolean | null = null;
  private _isValid = true;
  private _isDirty = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  get premiumRate() : number | null {
    return this._premiumRate;
  }
  set premiumRate(value: number | null) {
    this._premiumRate = value;
    this._isDirty = true;
  }
  get premium() : number | null {
    return this._premium;
  }
  set premium(value: number | null) {
    this._premium = value;
    this._isDirty = true;
  }
  get rateBasis() : number | null {
    return this._rateBasis;
  }
  set rateBasis(value: number | null) {
    this._rateBasis = value;
    this._isDirty = true;
  }
  get isFlatRate() : boolean | null {
    return this._isFlatRate;
  }
  set isFlatRate(value: boolean | null) {
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

  constructor(rate?: QuoteRate) {
    if (rate) {
      this.existingInit(rate);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.CoveragePremium);
    this.validate();
  }
  validate(){
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks
      this._validateOnLoad = false;
    }
    this._validationResults.mapValues(this);
    return this._validationResults;
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
  markDirty() {
    this._isDirty = true;
  }
  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }

  toJSON() {
    return {
      quoteId: this.quoteId,
      sequenceNo: this.sequenceNo,
      rateBasis: this.rateBasis,
      isFlatRate: this.isFlatRate,
      premiumRate: this.premiumRate,
      premium: this.premium
    };
  }
}
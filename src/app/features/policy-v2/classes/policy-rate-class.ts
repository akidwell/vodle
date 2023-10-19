import { ChildBaseClass } from './base/child-base-class';
import { PolicyRate } from '../models/policy-rate';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';


export class PolicyRateClass extends ChildBaseClass implements PolicyRate {
//   quoteId: number | null = null;
  sequenceNo: number | null = 0;
  // classCode: number | null = 0;
  invalidList: string[] = [];

  _isValid = true;
  _isDirty = false;
  _canBeSaved = true;
  _errorMessages: string[] = [];
  _validateOnLoad = true;

  private _premiumRate: number | undefined;
  private _premium: number | undefined;
  private _rateBasis: number | undefined;
  private _isFlatRate: boolean | undefined;

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

  constructor(rate?: PolicyRate) {
    super()
    if (rate) {
      this.existingInit(rate);
    } else {
      this.newInit();
    }
    // this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.CoveragePremium);
    this.validate();
  };


  validateObject(): ErrorMessage[]{
    console.log('validate  policy');
    //on load or if dirty validate this
    if (this.isDirty){
      //TODO: class based validation checks
      this.errorMessagesList = [];
      this.canBeSaved = true;
      this.isValid = true;
    //   console.log(this.pacCode);
    //   if(this.pacCode == ''){
    //     this.createErrorMessage('PacCode is required.');
    //   }
    }
    return this.errorMessagesList;
  }

  onGuidNewMatch(T: ChildBaseClass): void {
  }
  onGuidUpdateMatch(T: ChildBaseClass): void {
  }

  validate(){
    if (this._validateOnLoad || this.isDirty){
      this.classValidation();
      this._validateOnLoad = false;
    }
    // this._validationResults.resetValidation();
    // this._validationResults.mapValues(this);
    // return this._validationResults;
  }
  classValidation() {
    this.invalidList = [];
    this._canBeSaved = true;
    this._isValid = true;
    const amountValidation = this.validateAmount();
    if (amountValidation) {
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
  existingInit(rate: PolicyRate) {
    // this.quoteId = rate.quoteId;
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

  toJSON() {
    return {
    //   quoteId: this.quoteId,
      sequenceNo: this.sequenceNo,
      rateBasis: this.rateBasis,
      isFlatRate: this.isFlatRate,
      premiumRate: this.premiumRate,
      premium: this.premium
    };
  }
}

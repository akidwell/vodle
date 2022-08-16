import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationClass } from 'src/app/features/quote/classes/quote-validation-class';
import { MortgageeData } from 'src/app/features/quote/models/mortgagee';
import { QuoteValidation } from 'src/app/features/quote/models/quote-validation';

export class MortgageeClass implements MortgageeData, QuoteValidation{
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  private _buildingNumber: string | null = null;
  private _attention: string | null = null;
  private _description: string | null = null;
  private _premisesNumber: number | null = null;
  private _mortgageHolder: string | null = null;
  private _propertyQuoteId: number | null = null;
  private _propertyQuoteMortgageeId: number | null = null;
  private _street1: string | null = null;
  private _street2: string | null = null;
  private _state: string | null = null;
  private _city: string | null = null;
  private _zip: string | null = null;
  private _countryCode: string | null = null;
  private _isAppliedToAll = false;

  isNew = false;
  invalidList: string[] = [];
  isCopy = false;
  isZipLookup = false;


  constructor(mortgagee?: MortgageeData){
    if (mortgagee) {
      this.existingInit(mortgagee);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.PropertyMortgageeAdditionalInterest);
    this.validate();
  }

  validate(){
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks
      this.classValidation();
      this._validateOnLoad = false;
    }
    this._validationResults.resetValidation();
    this._validationResults.mapValues(this);
    return this._validationResults;
  }

  classValidation() {
    this.invalidList = [];
    // if (!this.validateAmount()) {
    //   valid = false;
    // }
    this._errorMessages = this.invalidList;
    this._canBeSaved = true;
    this._isValid = true;
  }

  existingInit(mortgagee?: MortgageeData){
    this._buildingNumber = mortgagee?.buildingNumber || null;
    this._attention = mortgagee?.attention || null;
    this._description = mortgagee?.description || null;
    this._premisesNumber = mortgagee?.premisesNumber || null;
    this._mortgageHolder = mortgagee?.mortgageHolder || null;
    this._propertyQuoteId = mortgagee?.propertyQuoteId || null;
    this._propertyQuoteMortgageeId = mortgagee?.propertyQuoteMortgageeId || null;
    this._street1 = mortgagee?.street1 || null;
    this._street2 = mortgagee?.street2 || null;
    this._state = mortgagee?.state || null;
    this._city = mortgagee?.city || null;
    this._zip = mortgagee?.zip || null;
    this._countryCode = mortgagee?.countryCode || null;
    this._isAppliedToAll = mortgagee?.isAppliedToAll || false;
  }

  newInit() {
    this.propertyQuoteId = 0;
    this.propertyQuoteMortgageeId = 0;
    this.isNew = true;
  }

  get validationResults(): QuoteValidationClass {
    return this._validationResults;
  }
  get canBeSaved(): boolean {
    return this._canBeSaved;
  }
  get errorMessages(): string[] {
    return this._errorMessages;
  }

  get buildingNumber() : string | null {
    return this._buildingNumber;
  }
  set buildingNumber(value: string | null) {
    this._buildingNumber = value;
    this._isDirty = true;
  }

  get attention() : string | null {
    return this._attention;
  }
  set attention(value: string | null) {
    this._attention = value;
    this._isDirty = true;
  }

  get isAppliedToAll() : boolean{
    return this._isAppliedToAll;
  }
  set isAppliedToAll(value: boolean) {
    this._isAppliedToAll = value;
    this._isDirty = true;
  }


  get description() : string | null {
    return this._description;
  }
  set description(value: string | null) {
    this._description = value;
    this._isDirty = true;
  }

  get premisesNumber() : number | null {
    return this._premisesNumber;
  }
  set premisesNumber(value: number | null) {
    this._premisesNumber= value;
    this._isDirty = true;
  }

  get propertyQuoteId() : number | null {
    return this._propertyQuoteId;
  }

  set propertyQuoteId(value: number | null) {
    this._propertyQuoteId = value;
    this._isDirty = true;
  }

  get propertyQuoteMortgageeId() : number | null {
    return this._propertyQuoteMortgageeId;
  }

  set propertyQuoteMortgageeId(value: number | null) {
    this._propertyQuoteMortgageeId = value;
    this._isDirty = true;
  }

  get mortgageHolder() : string | null {
    return this._mortgageHolder;
  }
  set mortgageHolder(value: string | null) {
    this._mortgageHolder = value;
    this._isDirty = true;
  }

  get street1() : string | null {
    return this._street1;
  }
  set street1(value: string | null) {
    this._street1 = value;
    this._isDirty = true;
  }

  get street2() : string | null {
    return this._street2;
  }
  set street2(value: string | null) {
    this._street2 = value;
    this._isDirty = true;
  }

  get city() : string | null {
    return this._city;
  }
  set city(value: string | null) {
    this._city = value;
    this._isDirty = true;
  }

  get state() : string | null {
    return this._state;
  }
  set state(value: string | null) {
    this._state = value;
    this._isDirty = true;
  }

  get zip() : string | null {
    return this._zip;
  }
  set zip(value: string | null) {
    this._zip = value;
    this._isDirty = true;
  }

  get countryCode() : string | null {
    return this._countryCode;
  }
  set countryCode(value: string | null) {
    this._countryCode = value;
    this._isDirty = true;
  }

  get isDirty() : boolean {
    return this._isDirty;
  }

  set isDity(value: boolean) {
    this._isDirty = value;
  }

  get isValid(): boolean {
    const valid = true;
    //valid = this.validate(valid);
    return valid;
  }

  set isValid(value: boolean){
    this.isValid = value;
  }

  markClean() {
    this._isDirty = false;
  }
  markDirty() {
    this._isDirty = true;
  }

  toJSON() {
    return {
      buildingNumber: this.buildingNumber,
      attention: this.attention,
      description: this.description,
      premisesNumber: this.premisesNumber,
      mortgageHolder: this.mortgageHolder,
      propertyQuoteId: this.propertyQuoteId,
      propertyQuoteMortgageeId: this.propertyQuoteMortgageeId,
      street1: this.street1,
      street2: this.street2,
      state: this.state,
      city: this.city,
      zip:this.zip,
      countryCode: this.countryCode,
      isAppliedToAll: this.isAppliedToAll
    };
  }

}


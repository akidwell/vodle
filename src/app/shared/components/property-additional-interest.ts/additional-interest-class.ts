import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationClass } from 'src/app/features/quote/classes/quote-validation-class';
import { AdditionalInterestData } from 'src/app/features/quote/models/additional-interest';
import { QuoteAfterSave } from 'src/app/features/quote/models/quote-after-save';
import { BuildingLocationClass } from '../../classes/building-location-class';
import { Validation } from '../../interfaces/validation';

export class AdditionalInterestClass extends BuildingLocationClass implements AdditionalInterestData, Validation, QuoteAfterSave{
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  //private _buildingNumber: number | null = null;
  private _attention: string | null = null;
  private _description: string | null = null;
  // private _premisesNumber: number | null = null;
  private _interest: string | null = null;
  private _propertyQuoteId: number | null = null;
  private _propertyQuoteAdditionalInterestId: number | null = null;
  private _street1: string | null = null;
  private _street2: string | null = null;
  private _state: string | null = null;
  private _city: string | null = null;
  private _zip: string | null = null;
  private _countryCode: string | null = null;
  // private _isAppliedToAll = false;

  isNew = false;
  guid = '';
  invalidList: string[] = [];
  isCopy = false;
  isZipLookup = false;

  constructor(ai?: AdditionalInterestData){
    super();
    if (ai) {
      this.existingInit(ai);
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
    this._canBeSaved = true;
    this._isValid = true;
    if (this.emptyStringValueCheck(this._interest)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Additional Interest - Interest is required');
    }
    if (!this.isAppliedToAll && (this.emptyNumberValueCheck(this.premisesNumber) || this.emptyNumberValueCheck(this.buildingNumber))) {
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Premises/Building Number is required');
    }
    if (this.emptyStringValueCheck(this._street1)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Additional Interest - Street is required');
    }
    if (this.emptyStringValueCheck(this._city)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Additional Interest - City is required');
    }
    if (this.emptyStringValueCheck(this._state)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Additional Interest - State is required');
    }
    if (this.emptyStringValueCheck(this._zip)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Additional Interest - Zip is required');
    }
    this._errorMessages = this.invalidList;
  }

  emptyNumberValueCheck(value: number | null | undefined) {
    return !value;
  }

  emptyStringValueCheck(value: string | null | undefined) {
    return !value;
  }
  existingInit(ai: AdditionalInterestData){
    this.isAppliedToAll = ai.isAppliedToAll;
    this.buildingNumber = ai.buildingNumber;
    this.premisesNumber = ai.premisesNumber;
    this._attention = ai.attention;
    this._description = ai.description;
    this._interest = ai.interest;
    this._propertyQuoteId = ai.propertyQuoteId;
    this._propertyQuoteAdditionalInterestId = ai.propertyQuoteAdditionalInterestId;
    this._street1 = ai.street1;
    this._street2 = ai.street2;
    this._state = ai.state;
    this._city = ai.city;
    this._zip = ai.zip;
    this._countryCode = ai.countryCode;
    this.guid = ai.guid;
  }

  newInit() {
    this.propertyQuoteId = 0;
    this.propertyQuoteAdditionalInterestId = 0;
    this.isNew = true;
    this.guid = crypto.randomUUID();
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

  // get buildingNumber() : number | null {
  //   return this._buildingNumber;
  // }
  // set buildingNumber(value: number | null) {
  //   this._buildingNumber = value;
  //   this._isDirty = true;
  // }

  // get building() : string | null {
  //   if (this._isAppliedToAll) {
  //     return 'All';
  //   }
  //   else if (this._premisesNumber == null || this._buildingNumber == null) {
  //     return null;
  //   }
  //   return this._premisesNumber.toString() + '-' + this._buildingNumber.toString();
  // }

  // set building(value: string | null) {
  //   if (value == 'All') {
  //     this._isAppliedToAll = true;
  //     this._premisesNumber = null;
  //     this._buildingNumber = null;
  //     this._isDirty = true;
  //   }
  //   else {
  //     const parse = value?.split('-');
  //     if (parse?.length == 2) {
  //       const premises = parse[0] ?? '';
  //       const building = parse[1] ?? '';
  //       this._isAppliedToAll = false;
  //       this._premisesNumber = isNaN(Number(premises)) ? null : Number(premises) ;
  //       this._buildingNumber = isNaN(Number(building)) ? null : Number(building) ;
  //       this._isDirty = true;
  //     }
  //     else {
  //       this._isAppliedToAll = false;
  //       this._premisesNumber = null;
  //       this._buildingNumber = null;
  //       this._isDirty = true;
  //     }
  //   }
  // }


  get attention() : string | null {
    return this._attention;
  }
  set attention(value: string | null) {
    this._attention = value;
    this._isDirty = true;
  }

  // get isAppliedToAll() : boolean {
  //   return this._isAppliedToAll;
  // }
  // set isAppliedToAll(value: boolean) {
  //   this._isAppliedToAll = value;
  //   this._isDirty = true;
  // }

  get description() : string | null {
    return this._description;
  }
  set description(value: string | null) {
    this._description = value;
    this._isDirty = true;
  }

  // get premisesNumber() : number | null {
  //   return this._premisesNumber;
  // }
  // set premisesNumber(value: number | null) {
  //   this._premisesNumber= value;
  //   this._isDirty = true;
  // }

  get propertyQuoteId() : number | null {
    return this._propertyQuoteId;
  }

  set propertyQuoteId(value: number | null) {
    this._propertyQuoteId = value;
    this._isDirty = true;
  }

  get propertyQuoteAdditionalInterestId(): number | null {
    return this._propertyQuoteAdditionalInterestId;
  }

  set propertyQuoteAdditionalInterestId(value: number | null) {
    this._propertyQuoteAdditionalInterestId = value;
    this._isDirty = true;
  }

  get interest() : string | null {
    return this._interest;
  }
  set interest(value: string | null) {
    this._interest = value;
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

  set isDirty(value: boolean) {
    this._isDirty = value;
  }

  get isValid(): boolean {
    //valid = this.validate(valid);
    return this._isValid;
  }

  set isValid(value: boolean){
    this.isValid = value;
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

  toJSON() {
    return {
      buildingNumber: this.buildingNumber,
      attention: this.attention,
      description: this.description,
      premisesNumber: this.premisesNumber,
      interest: this.interest,
      propertyQuoteId: this.propertyQuoteId,
      propertyQuoteAdditionalInterestId: this.propertyQuoteAdditionalInterestId,
      street1: this.street1,
      street2: this.street2,
      state: this.state,
      city: this.city,
      zip:this.zip,
      countryCode: this.countryCode,
      isAppliedToAll: this.isAppliedToAll,
      building: this.building,
      guid: this.guid
    };
  }

}


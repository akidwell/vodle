import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationClass } from 'src/app/features/quote/classes/quote-validation-class';
import { AdditionalInterestData } from 'src/app/features/quote/models/additional-interest';
import { QuoteAfterSave } from 'src/app/features/quote/models/quote-after-save';
import { BuildingLocationClass } from '../../classes/building-location-class';
import { Validation } from '../../interfaces/validation';
import { QuoteValidation } from 'src/app/features/quote/models/quote-validation';
import { PolicyValidation } from '../../interfaces/policy-validation';
import { ErrorMessage } from '../../interfaces/errorMessage';
import { ChildBaseClass } from 'src/app/features/policy-v2/classes/base/child-base-class';

export class AdditionalInterestClass extends ChildBaseClass implements AdditionalInterestData, QuoteValidation, QuoteAfterSave{
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  private _attention: string | null = null;
  private _description: string | null = null;
  private _interest: string | null = null;
  private _propertyQuoteId: number | null = null;
  private _propertyQuoteAdditionalInterestId: number | null = null;
  private _endorsementAdditionalInterestId: number | null = null;
  private _street1: string | null = null;
  private _street2: string | null = null;
  private _state: string | null = null;
  private _city: string | null = null;
  private _zip: string | null = null;
  private _countryCode: string | null = null;
  private _additionalInterestType: number | null = 1;
  private _buildingNumber: number | null = null;
  private _premisesNumber: number | null = null;
  private _isAppliedToAll = false;

  isNew = false;
  guid = '';
  invalidList: string[] = [];
  isCopy = false;
  isZipLookup = false;

  private _isDuplicate = false;
  get isDuplicate(): boolean {
    return this._isDuplicate;
  }
  set isDuplicate(value: boolean ) {
    this._isDuplicate = value;
  }

  private _markForDeletion = false;
  get markForDeletion() : boolean {
    return this._markForDeletion;
  }
  set markForDeletion(value: boolean) {
    this._markForDeletion = value;
    console.log('in markdeletion', value);
    this.markDirty();
  }

  constructor(ai?: AdditionalInterestData){
    super();
    console.log('AI')
    if (ai) {
      this.existingInit(ai);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.PropertyMortgageeAdditionalInterest);
    this.validate();
  }

  validateObject(): ErrorMessage[] {
    this.validate();
    return this.errorMessagesList;
  }
  onGuidNewMatch(T: PolicyValidation): void {

  }
  onGuidUpdateMatch(T: PolicyValidation): void {

  }
  onSaveCompletion(T: PolicyValidation[]): void {

  }

  validate(){
    this.errorMessagesList = [];
    this.invalidList = [];
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
    this.canBeSaved = true;
    this.isValid = true;
    this.errorMessagesList = [];
    if (this.emptyStringValueCheck(this._interest)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Additional Interest - Interest is required');
      this.createErrorMessage('Additional Interest - Interest is required');
    }
    if (!this.isAppliedToAll && (this.emptyNumberValueCheck(this.premisesNumber) || this.emptyNumberValueCheck(this.buildingNumber))) {
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Premises/Building Number is required');
      this.createErrorMessage('Premises/Building Number is required');
    }
    if (this.emptyStringValueCheck(this._street1)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Additional Interest - Street is required');
      this.createErrorMessage('Additional Interest - Street is required');
    }
    if (this.emptyStringValueCheck(this._zip)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Additional Interest - Zipcode is required');
      this.createErrorMessage('Additional Interest - Zipcode is required');
    }
    if (this.emptyStringValueCheck(this._city)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Additional Interest - City is required');
      this.createErrorMessage('Additional Interest - City is required');
    }
    if (this.emptyStringValueCheck(this._state)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Additional Interest - State is required');
      this.createErrorMessage('Additional Interest - State is required');
    }
    if (this.emptyStringValueCheck(this._additionalInterestType?.toString())){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Additional Interest - Type is required');
      this.createErrorMessage('Additional Interest - Type is required');
    }
    if (this.isDuplicate){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Duplicate Additional Interest exist');
      this.createErrorMessage('Duplicate Additional Interest exist');
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
    this._isAppliedToAll = ai.isAppliedToAll;
    this._buildingNumber = ai.buildingNumber;
    this._premisesNumber = ai.premisesNumber;
    this._attention = ai.attention;
    this._description = ai.description;
    this._interest = ai.interest;
    this._propertyQuoteId = ai.propertyQuoteId;
    this._propertyQuoteAdditionalInterestId = ai.propertyQuoteAdditionalInterestId;
    this._endorsementAdditionalInterestId = ai.endorsementAdditionalInterestId;
    this._street1 = ai.street1;
    this._street2 = ai.street2;
    this._state = ai.state;
    this._city = ai.city;
    this._zip = ai.zip;
    this._countryCode = ai.countryCode;
    this._additionalInterestType = ai.additionalInterestType;
    this.guid = ai.guid;
  }

  newInit() {
    this.propertyQuoteId = 0;
    this.propertyQuoteAdditionalInterestId = 0;
    this.endorsementAdditionalInterestId = 0;
    this.isNew = true;
    this.guid = crypto.randomUUID();
    this.additionalInterestType = 1;
  }

  get validationResults(): QuoteValidationClass {
    return this._validationResults;
  }
  // get canBeSaved(): boolean {
  //   return this.canBeSaved;
  // }
  get errorMessages(): string[] {
    return this._errorMessages;
  }
  set errorMessages(value: string[]){
    this._errorMessages = value;
  }
  get buildingNumber() : number | null {
    return this._buildingNumber;
  }
  set buildingNumber(value: number | null) {
    this._buildingNumber = value;
    this.markDirty();
  }

  get building() : string | null {
    if (this._isAppliedToAll) {
      return 'All';
    }
    else if (this._premisesNumber == null || this._buildingNumber == null) {
      return null;
    }
    return this._premisesNumber.toString() + '-' + this._buildingNumber.toString();
  }

  set building(value: string | null) {
    if (value == 'All') {
      this._isAppliedToAll = true;
      this._premisesNumber = null;
      this._buildingNumber = null;
      this.markDirty();
    }
    else {
      const parse = value?.split('-');
      if (parse?.length == 2) {
        const premises = parse[0] ?? '';
        const building = parse[1] ?? '';
        this._isAppliedToAll = false;
        this._premisesNumber = isNaN(Number(premises)) ? null : Number(premises) ;
        this._buildingNumber = isNaN(Number(building)) ? null : Number(building) ;
        this.markDirty();
      }
      else {
        this._isAppliedToAll = false;
        this._premisesNumber = null;
        this._buildingNumber = null;
        this.markDirty();
      }
    }
  }
  get endorsementAdditionalInterestId() : number | null {
    return this._endorsementAdditionalInterestId;
  }

  set endorsementAdditionalInterestId(value: number | null) {
    this._endorsementAdditionalInterestId = value;
    this.markDirty();
  }

  get attention() : string | null {
    return this._attention;
  }
  set attention(value: string | null) {
    this._attention = value;
    this.markDirty();
  }

  get isAppliedToAll() : boolean {
    return this._isAppliedToAll;
  }
  set isAppliedToAll(value: boolean) {
    this._isAppliedToAll = value;
    this.markDirty();
  }

  get description() : string | null {
    return this._description;
  }
  set description(value: string | null) {
    this._description = value;
    this.markDirty();
  }
  get additionalInterestType() : number | null {
    return this._additionalInterestType;
  }
  set additionalInterestType(value: number | null) {
    this._additionalInterestType = value;
    this.markDirty();
  }


  get premisesNumber() : number | null {
    return this._premisesNumber;
  }
  set premisesNumber(value: number | null) {
    this._premisesNumber= value;
    this.markDirty();
  }

  get propertyQuoteId() : number | null {
    return this._propertyQuoteId;
  }

  set propertyQuoteId(value: number | null) {
    this._propertyQuoteId = value;
    this.markDirty();
  }

  get propertyQuoteAdditionalInterestId(): number | null {
    return this._propertyQuoteAdditionalInterestId;
  }

  set propertyQuoteAdditionalInterestId(value: number | null) {
    this._propertyQuoteAdditionalInterestId = value;
    this.markDirty();
  }

  get interest() : string | null {
    return this._interest;
  }
  set interest(value: string | null) {
    this._interest = value;
    this.markDirty();
  }

  get street1() : string | null {
    return this._street1;
  }
  set street1(value: string | null) {
    this._street1 = value;
    this.markDirty();
  }

  get street2() : string | null {
    return this._street2;
  }
  set street2(value: string | null) {
    this._street2 = value;
    this.markDirty();
  }

  get city() : string | null {
    return this._city;
  }
  set city(value: string | null) {
    this._city = value;
    this.markDirty();
  }

  get state() : string | null {
    return this._state;
  }
  set state(value: string | null) {
    this._state = value;
    this.markDirty();
  }

  get zip() : string | null {
    return this._zip;
  }
  set zip(value: string | null) {
    this._zip = value;
    this.markDirty();
  }

  get countryCode() : string | null {
    return this._countryCode;
  }
  set countryCode(value: string | null) {
    this._countryCode = value;
    this.markDirty();
  }

  // get isDirty() : boolean {
  //   return this.isDirty;
  // }

  // set isDirty(value: boolean) {
  //   this.isDirty = value;
  // }

  // get isValid(): boolean {
  //   //valid = this.validate(valid);
  //   return this.isValid;
  // }

  // set isValid(value: boolean){
  //   this.isValid = value;
  // }


  markStructureClean(): void {
    this.markClean();
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
      endorsementAdditionalInterestId: this.endorsementAdditionalInterestId,
      street1: this.street1,
      street2: this.street2,
      state: this.state,
      city: this.city,
      zip:this.zip,
      countryCode: this.countryCode,
      isAppliedToAll: this.isAppliedToAll,
      building: this.building,
      additionalInterestType: this.additionalInterestType,
      guid: this.guid
    };
  }

}


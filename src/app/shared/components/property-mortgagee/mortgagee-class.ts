import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationClass } from 'src/app/features/quote/classes/quote-validation-class';
import { MortgageeData } from 'src/app/features/quote/models/mortgagee';
import { QuoteAfterSave } from 'src/app/features/quote/models/quote-after-save';
import { BuildingLocationClass } from '../../classes/building-location-class';
import { Validation } from '../../interfaces/validation';

export class MortgageeClass extends BuildingLocationClass implements MortgageeData, Validation, QuoteAfterSave{
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  //private _buildingNumber: number | null = null;
  private _attention: string | null = null;
  private _description: string | null = null;
  //private _premisesNumber: number | null = null;
  private _mortgageHolder: string | null = null;
  private _propertyQuoteId: number | null = null;
  private _propertyQuoteMortgageeId: number | null = null;
  private _street1: string | null = null;
  private _street2: string | null = null;
  private _state: string | null = null;
  private _city: string | null = null;
  private _zip: string | null = null;
  private _countryCode: string | null = null;
  private _mortgageeType: number | null = 1;
  //private _isAppliedToAll = false;
  private _isNew!: boolean;

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

  constructor(mortgagee?: MortgageeData){
    super();
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
    this._canBeSaved = true;
    this._isValid = true;
    if (this.emptyStringValueCheck(this._mortgageHolder)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Mortgagee - Mortgagee Holder is required');
    }
    if (!this.isAppliedToAll && (this.emptyNumberValueCheck(this.premisesNumber) || this.emptyNumberValueCheck(this.buildingNumber))) {
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Premises/Building Number is required');
    }
    if (this.emptyStringValueCheck(this._street1)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Mortgagee - Street is required');
    }
    if (this.emptyStringValueCheck(this._city)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Mortgagee - City is required');
    }
    if (this.emptyStringValueCheck(this._state)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Mortgagee - State is required');
    }
    if (this.emptyStringValueCheck(this._zip)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Mortgagee - Zip is required');
    }
    if (this.emptyStringValueCheck(this._mortgageeType?.toString())){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Mortgagee - Type is required');
    }
    if (this.isDuplicate){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Duplicate Mortgagees exist');
    }
    this._errorMessages = this.invalidList;
  }

  emptyNumberValueCheck(value: number | null | undefined) {
    return !value;
  }
  emptyStringValueCheck(value: string | null | undefined) {
    return !value;
  }

  existingInit(mortgagee: MortgageeData){
    this.isAppliedToAll = mortgagee.isAppliedToAll;
    this.premisesNumber = mortgagee.premisesNumber;
    this.buildingNumber = mortgagee.buildingNumber;
    this._attention = mortgagee.attention;
    this._description = mortgagee.description ;
    this._mortgageHolder = mortgagee.mortgageHolder;
    this._propertyQuoteId = mortgagee.propertyQuoteId;
    this._propertyQuoteMortgageeId = mortgagee.propertyQuoteMortgageeId;
    this._street1 = mortgagee.street1;
    this._street2 = mortgagee.street2;
    this._state = mortgagee.state;
    this._city = mortgagee.city;
    this._zip = mortgagee.zip;
    this._countryCode = mortgagee.countryCode;
    this._mortgageeType = mortgagee.mortgageeType;
    this.guid = mortgagee.guid;
  }

  newInit() {
    this.propertyQuoteId = 0;
    this.propertyQuoteMortgageeId = 0;
    this.mortgageeType = 1;
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
  //}

  get attention() : string | null {
    return this._attention;
  }
  set attention(value: string | null) {
    this._attention = value;
    this._isDirty = true;
  }

  // get isAppliedToAll() : boolean{
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

  get mortgageeType() : number | null {
    return this._mortgageeType;
  }
  set mortgageeType(value: number | null) {
    this._mortgageeType = value;
    this._isDirty = true;
  }

  get isDirty() : boolean {
    return this._isDirty;
  }

  set isDirty(value: boolean) {
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
      mortgageHolder: this.mortgageHolder,
      propertyQuoteId: this.propertyQuoteId,
      propertyQuoteMortgageeId: this.propertyQuoteMortgageeId,
      street1: this.street1,
      street2: this.street2,
      state: this.state,
      city: this.city,
      zip:this.zip,
      countryCode: this.countryCode,
      isAppliedToAll: this.isAppliedToAll,
      guid: this.guid,
      building: this.building,
      isNew: this.isNew,
      mortgageeType: this.mortgageeType
    };
  }

}


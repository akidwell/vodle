import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { PropertyBuilding } from '../models/property-building';
import { QuoteValidation } from '../models/quote-validation';
import { QuoteValidationClass } from './quote-validation-class';
import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';

export class PropertyQuoteBuildingClass implements PropertyBuilding, QuoteValidation {
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  propertyQuoteBuildingId: number | null = null;
  propertyQuoteId: number | null = null;
  propertyQuoteBuildingCoverage: PropertyQuoteBuildingCoverageClass[] = [];
  taxCode: string | null = null;

  private _subjectNumber: number | null = null;
  private _premisesNumber: number | null = null;
  private _buildingNumber: number | null = null;
  private _street1: string | null = null;
  private _street2: string | null = null;
  private _city: string | null = null;
  private _state: string | null = null;
  private _zip: string | null = null;
  private _countryCode: string | null = null;
  private _cspCode: string | null = null;
  private _description: string | null = null;
  private _occupancy: string | null = null;
  private _yearBuilt: number | null = null;
  private _gutRehab: number | null = null;
  private _sprinklered: number | null = null;
  private _construction: string | null = null;
  private _stories: number | null = null;
  private _protectionClass: number | null = null;
  private _roof: number | null = null;
  private _wiring: number | null = null;
  private _plumbing: number | null = null;
  private _hvac: number | null = null;

  isNew = false;
  invalidList: string[] = [];
  isZipLookup = false;
  isImport = false;

  get subjectNumber() : number | null {
    return this._subjectNumber;
  }
  set subjectNumber(value: number | null) {
    this._subjectNumber = value;
    this._isDirty = true;
  }
  get isDirty(): boolean {
    return this._isDirty ;
  }
  get isValid(): boolean {
    // let valid = true;
    // valid = this.validate(valid);
    return this._isValid;
  }
  get canBeSaved(): boolean {
    return this._canBeSaved;
  }
  get errorMessages(): string[] {
    return this._errorMessages;
  }
  get validationResults(): QuoteValidationClass {
    return this._validationResults;
  }
  get premisesNumber(): number | null {
    return this._premisesNumber;
  }
  set premisesNumber(value: number | null) {
    this._premisesNumber = value;
    this._isDirty = true;
  }
  get buildingNumber(): number | null {
    return this._buildingNumber;
  }
  set buildingNumber(value: number | null) {
    this._buildingNumber = value;
    this._isDirty = true;
  }
  get street1(): string | null {
    return this._street1;
  }
  set street1(value: string | null) {
    this._street1 = value;
    this._isDirty = true;
  }
  get street2(): string | null {
    return this._street2;
  }
  set street2(value: string | null) {
    this._street2 = value;
    this._isDirty = true;
  }
  get city(): string | null {
    return this._city;
  }
  set city(value: string | null) {
    this._city = value;
    this._isDirty = true;
  }
  get state(): string | null {
    return this._state;
  }
  set state(value: string | null) {
    this._state = value;
    this._isDirty = true;
  }
  get zip(): string | null {
    return this._zip;
  }
  set zip(value: string | null) {
    this._zip = value;
    this._isDirty = true;
  }
  get countryCode(): string | null {
    return this._countryCode;
  }
  set countryCode(value: string | null) {
    this._countryCode = value;
    this._isDirty = true;
  }
  get cspCode(): string | null {
    return this._cspCode;
  }
  set cspCode(value: string | null) {
    this._cspCode = value;
    this._isDirty = true;
  }
  get description(): string | null {
    return this._description;
  }
  set description(value: string | null) {
    this._description = value;
    this._isDirty = true;
  }
  get occupancy(): string | null {
    return this._occupancy;
  }
  set occupancy(value: string | null) {
    this._occupancy = value;
    this._isDirty = true;
  }
  get yearBuilt(): number | null {
    return this._yearBuilt;
  }
  set yearBuilt(value: number | null) {
    this._yearBuilt = value;
    this._isDirty = true;
  }
  get gutRehab(): number | null {
    return this._gutRehab;
  }
  set gutRehab(value: number | null) {
    this._gutRehab = value;
    this._isDirty = true;
  }
  get sprinklered(): number | null {
    return this._sprinklered;
  }
  set sprinklered(value: number | null) {
    this._sprinklered = value;
    this._isDirty = true;
  }
  get construction(): string | null {
    return this._construction;
  }
  set construction(value: string | null) {
    this._construction = value;
    this._isDirty = true;
  }
  get stories(): number | null {
    return this._stories;
  }
  set stories(value: number | null) {
    this._stories = value;
    this._isDirty = true;
  }
  get protectionClass(): number | null {
    return this._protectionClass;
  }
  set protectionClass(value: number | null) {
    this._protectionClass = value;
    this._isDirty = true;
  }
  get roof(): number | null {
    return this._roof;
  }
  set roof(value: number | null) {
    this._roof = value;
    this._isDirty = true;
  }
  get wiring(): number | null {
    return this._wiring;
  }
  set wiring(value: number | null) {
    this._wiring = value;
    this._isDirty = true;
  }
  get plumbing(): number | null {
    return this._plumbing;
  }
  set plumbing(value: number | null) {
    this._plumbing = value;
    this._isDirty = true;
  }
  get hvac(): number | null {
    return this._hvac;
  }
  set hvac(value: number | null) {
    this._hvac = value;
    this._isDirty = true;
  }

  get buildingIndex(): string {
    return (this.subjectNumber ?? '') + '/' + (this.premisesNumber ?? '')+ '/' + (this.buildingNumber ?? '');
  }
  get address(): string {
    return (!this.street1 ? '' : this.street1) +
    (!this.street2 ? '' : ', ' + this.street2) +
    (!this.city ? '' : ', ' + this.city ) +
    (!this.state ? '' : ', ' + this.state) +
    (!this.zip ? '' : ' ' + this.zip);
  }

  constructor(building?: PropertyBuilding) {
    if (building) {
      this.existingInit(building);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.PropertyLocationCoverages);
    this.validate();
  }
  validate(){
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks
      this.classValidation();
      this._validateOnLoad = false;
    }
    const validation = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.CoveragePremium);
    validation.mapValues(this);
    return validation;
  }
  existingInit(building: PropertyBuilding) {
    this.propertyQuoteBuildingId = building.propertyQuoteBuildingId;
    this.propertyQuoteId = building.propertyQuoteId;
    this.taxCode = building.taxCode;
    this._subjectNumber = building.subjectNumber;
    this._premisesNumber = building.premisesNumber;
    this._buildingNumber = building.buildingNumber;
    this._street1 = building.street1;
    this._street2 = building.street2;
    this._city = building.city;
    this._state = building.state;
    this._zip = building.zip;
    this._countryCode = building.countryCode;
    this._cspCode = building.cspCode;
    this._description = building.description;
    this._occupancy = building.occupancy;
    this._yearBuilt = building.yearBuilt;
    this._sprinklered = building.sprinklered;
    this._construction = building.construction;
    this._stories = building.stories;
    this._protectionClass = building.protectionClass;
    this._roof = building.roof;
    this._wiring = building.wiring;
    this._plumbing = building.plumbing;
    this._hvac = building.hvac;

    const coverages: PropertyQuoteBuildingCoverageClass[] = [];
    building.propertyQuoteBuildingCoverage.forEach((element) => {
      coverages.push(new PropertyQuoteBuildingCoverageClass(element));
    });
    this.propertyQuoteBuildingCoverage = coverages;

    this.setReadonlyFields();
    this.setRequiredFields();
  }

  markImported() {
    this.isNew = true;
    this.isImport = true;
    this.propertyQuoteBuildingCoverage.forEach((c) => {
      c.isNew = true;
      c.isImport = true;
    });
  }

  subjectNumberRequired = true;
  premisesNumberRequired = true;
  buildingNumberRequired = true;
  street1Required = true;
  get zipRequired(): boolean {
    return true;
  }
  get cityRequired(): boolean {
    return true;
  }
  get stateRequired(): boolean {
    return true;
  }

  get zipReadonly(): boolean {
    return false;
  }
  get stateReadonly(): boolean {
    return this.isZipLookup;
  }
  get cityReadonly(): boolean {
    return this.isZipLookup;
  }

  newInit() {
    this.isNew = true;
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

  classValidation() {
    this.invalidList = [];
    // if (!this.validateAmount()) {
    //   valid = false;
    // }
    this._errorMessages = this.invalidList;
    this._canBeSaved = true;
    this._isValid = true;
  }
  get validateAddress(): boolean {
    return !(!this.street1 || !this.city);
  }
}

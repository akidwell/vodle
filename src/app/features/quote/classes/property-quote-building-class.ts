import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { PropertyBuilding } from '../models/property-building';
import { QuoteValidationClass } from './quote-validation-class';
import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';
import { PropertyQuoteClass } from './property-quote-class';
import { PropertyBuildingCoverageData } from '../models/property-building-coverage';
import { ZipCodePipe } from 'src/app/shared/pipes/zip-code.pipe';
import { QuoteAfterSave } from '../models/quote-after-save';
import { Validation } from 'src/app/shared/interfaces/validation';
import { Code } from 'src/app/core/models/code';

export class PropertyQuoteBuildingClass implements PropertyBuilding, Validation, QuoteAfterSave {
  private _isDirty = false;
  private _isValid = true;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;
  private _isDuplicate = false;

  propertyQuoteBuildingId = 0;
  propertyQuoteId = 0;
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
  private _cspCode : string | null = null;
  private _description: string | null = null;
  private _occupancy: string | null = null;
  private _squareFeet: number | null = null;
  private _itv: number | null = null;
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
  guid = '';
  invalidList: string[] = [];
  isZipLookup = false;
  isImport = false;
  isExpanded = false;
  expand = false;
  focus = false;
  propertyQuote!: PropertyQuoteClass;

  get subjectNumber() : number | null {
    return this._subjectNumber;
  }
  set subjectNumber(value: number | null) {
    this._subjectNumber = value;
    this._isDirty = true;
    this.propertyQuoteBuildingCoverage.map(c => c.subjectNumber = value);
    this.propertyQuote.calculateSubjectAmounts();
    this.propertyQuote.calculateLargestPremTiv();
    this.propertyQuote.calculateLargestExposure();
    this.propertyQuote.calculateLawLimits();
  }
  get isDirty(): boolean {
    return this._isDirty ;
  }
  get isValid(): boolean {
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
  get isDuplicate(): boolean {
    return this._isDuplicate;
  }
  set isDuplicate(value: boolean ) {
    this._isDuplicate = value;
    this._isDirty = true;
  }
  get premisesNumber(): number | null {
    return this._premisesNumber;
  }
  set premisesNumber(value: number | null) {
    this._premisesNumber = value;
    this._isDirty = true;
    this.propertyQuoteBuildingCoverage.map(c => c.premisesNumber = value);
    this.propertyQuote.calculateLargestPremTiv();
    this.propertyQuote.calculateLargestExposure();
    this.propertyQuote.calculateLawLimits();
  }
  get buildingNumber(): number | null {
    return this._buildingNumber;
  }
  set buildingNumber(value: number | null) {
    // Need to Check with original value
    this.propertyQuote.onPremisesBuildingChange(this._premisesNumber,this._buildingNumber);
    this._buildingNumber = value;
    this._isDirty = true;
    this.propertyQuoteBuildingCoverage.map(c => c.buildingNumber = value);
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
  get cspCode(): string | null{
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
  get squareFeet(): number | null {
    return this._squareFeet;
  }
  set squareFeet(value: number | null) {
    this._squareFeet = value;
    this._isDirty = true;
    this.calculateITV();
  }
  get itv(): number | null {
    return this._itv;
  }
  set itv(value: number | null) {
    this._itv = value;
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
    (!this.zip ? '' : ' ' + this.zipPipe.transform(this.zip));
  }

  private zipPipe = new ZipCodePipe();

  calculateITV() {
    const buildingLimit = this.propertyQuoteBuildingCoverage.find(c => c.propertyCoverageId == 1)?.limit;
    if (this._squareFeet == null || buildingLimit == null) {
      this.itv = null;
    }
    else {
      this._itv = Math.round((buildingLimit ?? 0) / (this._squareFeet ?? 1));
      this._isDirty = true;
    }
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
    this._validationResults.resetValidation();

    this.callChildValidations();
    this._validationResults.mapValues(this);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteBuildingCoverage);
    return this._validationResults;
  }
  callChildValidations() {
    this.childArrayValidate(this.propertyQuoteBuildingCoverage);
  }
  childArrayValidate(children: Validation[]) {
    children.forEach(child => {
      child.validate ? child.validate() : null;
    });
  }
  markChildrenClean() {
    this.cleanChildArray(this.propertyQuoteBuildingCoverage);
  }
  cleanChildArray(children: QuoteAfterSave[]) {
    children.forEach(child => {
      child.markStructureClean();
    });
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
    this._squareFeet = building.squareFeet;
    this._sprinklered = building.sprinklered;
    this._construction = building.construction;
    this._stories = building.stories;
    this._protectionClass = building.protectionClass;
    this._roof = building.roof;
    this._wiring = building.wiring;
    this._plumbing = building.plumbing;
    this._hvac = building.hvac;
    this._itv = building.itv;

    const coverages: PropertyQuoteBuildingCoverageClass[] = [];
    building.propertyQuoteBuildingCoverage?.forEach((element) => {
      const coverage = new PropertyQuoteBuildingCoverageClass(element);
      coverage.building = this;
      coverage.subjectNumber = this._subjectNumber;
      coverage.premisesNumber = this._premisesNumber;
      coverage.buildingNumber = this._buildingNumber;
      coverages.push(coverage);
    });
    this.propertyQuoteBuildingCoverage = coverages;
    this.setReadonlyFields();
    this.setRequiredFields();
  }

  markImported() {
    this.isNew = true;
    this.isImport = true;
    this.guid = crypto.randomUUID();
    this.propertyQuoteBuildingCoverage.forEach((c) => {
      c.isNew = true;
      c.isImport = true;
      c.guid = crypto.randomUUID();
    });
  }

  addCoverage() {
    const newCoverage = new PropertyQuoteBuildingCoverageClass();
    newCoverage.building = this;
    newCoverage.focus = true;
    newCoverage.subjectNumber = this._subjectNumber;
    newCoverage.premisesNumber = this._premisesNumber;
    newCoverage.buildingNumber = this._buildingNumber;
    this.propertyQuoteBuildingCoverage.push(newCoverage);
    this.propertyQuote.filterCoverages();
    this.propertyQuote.calculateSubjectAmounts();
    this.propertyQuote.calculateLargestPremTiv();
    this.propertyQuote.calculateLargestExposure();
    this.propertyQuote.calculateLawLimits();
  }

  copyCoverage(coverage: PropertyQuoteBuildingCoverageClass) {
    coverage.building = this;
    coverage.expand = true;
    coverage.focus = true;
    coverage.propertyQuoteBuildingCoverageId = 0;
    coverage.propertyQuoteBuildingId = 0;
    coverage.subjectNumber = this._subjectNumber;
    coverage.premisesNumber = this._premisesNumber;
    coverage.buildingNumber = this._buildingNumber;
    coverage.isNew = true;
    coverage.markDirty();
    this.propertyQuoteBuildingCoverage.push(coverage);
    this.propertyQuote.filterCoverages();
    this.propertyQuote.calculateSubjectAmounts();
    this.propertyQuote.calculateLargestPremTiv();
    this.propertyQuote.calculateLargestExposure();
    this.propertyQuote.calculateLawLimits();
  }

  deleteCoverage(coverage: PropertyQuoteBuildingCoverageClass) {
    const index = this.propertyQuoteBuildingCoverage.indexOf(coverage, 0);
    if (index > -1) {
      this.propertyQuoteBuildingCoverage.splice(index, 1);
    }
    this.propertyQuote.filterCoverages();
    this.propertyQuote.calculateSubjectAmounts();
    this.propertyQuote.calculateLargestPremTiv();
    this.propertyQuote.calculateLargestExposure();
    this.propertyQuote.calculateLawLimits();

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
    this.propertyQuoteBuildingId = 0;
    this.propertyQuoteId = 0;
    this.expand = true;
    this.isNew = true;
    this._isDirty = true;
    this.guid = crypto.randomUUID();
  }

  markClean() {
    this._isDirty = false;
  }
  markStructureClean(): void {
    this.markClean();
    this.markChildrenClean();
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
    this._canBeSaved = true;
    this._isValid = true;

    if (this.emptyNumberValueCheck(this._subjectNumber)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Subject Number is required');
    }
    if (this.emptyNumberValueCheck(this._premisesNumber)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Premises Number is required');
    }
    if (this.emptyNumberValueCheck(this._buildingNumber)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Building Number is required');
    }
    if (this.emptyStringValueCheck(this._street1)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Street is required');
    }
    if (this.emptyStringValueCheck(this._city)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' City is required');
    }
    if (this.emptyStringValueCheck(this._state)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' State is required');
    }
    if (this.emptyStringValueCheck(this._zip)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Zip is required');
    }
    if ((this._sprinklered ?? 0) > 100){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Sprinklered% mush be <= 100%');
    }
    if (this.isDuplicate){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' is duplicated');
    }
    if (this._yearBuilt != null && (this._yearBuilt < 1000 || this._yearBuilt > 9999)) {
      this._isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Year Built is invalid');
    }
    if (this.emptyStringValueCheck(this._cspCode)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Csp Code for building ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?' + ' is required'));
    }
    this._errorMessages = this.invalidList;
  }
  emptyNumberValueCheck(value: number | null | undefined) {
    return !value;
  }
  emptyStringValueCheck(value: string | null | undefined) {
    return !value;
  }
  get validateAddress(): boolean {
    return !(!this.street1 || !this.city);
  }

  toJSON() {
    const coverages: PropertyBuildingCoverageData[] = [];
    this.propertyQuoteBuildingCoverage.forEach(c => coverages.push(c.toJSON()));

    return {
      propertyQuoteBuildingId: this.propertyQuoteBuildingId,
      propertyQuoteId: this.propertyQuoteId,
      subjectNumber: this.subjectNumber,
      premisesNumber: this.premisesNumber,
      buildingNumber: this.buildingNumber,
      street1: this.street1,
      street2: this.street2,
      city: this.city,
      state: this.state,
      zip: this.zip,
      countryCode: this.countryCode,
      cspCode: this.cspCode,
      taxCode: this.taxCode,
      description: this.description,
      occupancy: this.occupancy,
      squareFeet: this.squareFeet,
      itv: this.itv,
      yearBuilt: this.yearBuilt,
      gutRehab: this.gutRehab,
      sprinklered: this.sprinklered,
      construction: this.construction,
      stories: this.stories,
      protectionClass: this.protectionClass,
      roof: this.roof,
      wiring: this.wiring,
      plumbing: this.plumbing,
      hvac: this.hvac,
      propertyQuoteBuildingCoverage: coverages,
      guid: this.guid
    };
  }
}

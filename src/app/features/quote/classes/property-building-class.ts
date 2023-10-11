import { PropertyBuilding } from '../models/property-building';
import { PropertyQuoteClass } from './property-quote-class';
import { PropertyBuildingCoverage } from '../models/property-building-coverage';
import { ZipCodePipe } from 'src/app/shared/pipes/zip-code.pipe';
import { QuoteAfterSave } from '../models/quote-after-save';
import { Validation } from 'src/app/shared/interfaces/validation';
import { ParentBaseClass } from '../../policy-v2/classes/base/parent-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { PropertyBuildingCoverageClass } from './property-building-coverage-class';
import { PropertyPolicyBuildingCoverageClass } from './property-policy-building-coverage-class';
import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { ErrorMessageSettings } from '../../policy-v2/classes/base/child-base-class';


export abstract class PropertyBuildingClass extends ParentBaseClass implements PropertyBuilding {
  propertyQuoteBuildingId: number | null = 0;
  endorsementBuildingId: number | null = 0;
  propertyQuoteId: number | null = 0;
  propertyPolicyId: number | null = 0;

  validateParent(): ErrorMessage[] {
    return [];
  }

  abstract validate(): Validation;


  onChildDeletion(child: Deletable): void {
    console.log('in child deletion');

  }

  onDelete(): void {
    console.log('delete match');
  }

  public _errorMessagesList: ErrorMessage[] = [];
  public _validateOnLoad = true;
  public _isDuplicate = false;
  public _isDirty = false;
  public _isValid = true;
  public _canBeSaved = true;
  public _errorMessages: string[] = [];

  propertyQuoteBuildingCoverage: PropertyQuoteBuildingCoverageClass[] = [];
  endorsementBuildingCoverage: PropertyPolicyBuildingCoverageClass[] = [];


  taxCode: string | null = null;

  public _subjectNumber: number | null = null;
  public _premisesNumber: number | null = null;
  public _buildingNumber: number | null = null;
  public _street1: string | null = null;
  public _street2: string | null = null;
  public _city: string | null = null;
  public _state: string | null = null;
  public _zip: string | null = null;
  public _countryCode: string | null = null;
  public _cspCode : string | null = null;
  public _description: string | null = null;
  public _occupancy: string | null = null;
  public _squareFeet: number | null = null;
  public _itv: number | null = null;
  public _yearBuilt: number | null = null;
  public _gutRehab: number | null = null;
  public _sprinklered: number | null = null;
  public _construction: string | null = null;
  public _stories: number | null = null;
  public _protectionClass: number | null = null;
  public _roof: number | null = null;
  public _wiring: number | null = null;
  public _plumbing: number | null = null;
  public _hvac: number | null = null;

  isNew = false;
  guid = '';
  invalidList: string[] = [];
  isZipLookup = false;
  isImport = false;
  isExpanded = false;
  expand = false;
  focus = false;
  property!: PropertyQuoteClass;

  abstract subjectNumber: number | null;

  abstract premisesNumber: number | null;

  abstract buildingNumber: number | null;

  private _markForDeletion = false;
  get markForDeletion() : boolean {
    return this._markForDeletion;
  }
  set markForDeletion(value: boolean) {
    this._markForDeletion = value;
    console.log('in markdeletion', value);
    this.markDirty();
  }

  get isDuplicate(): boolean {
    return this._isDuplicate;
  }
  set isDuplicate(value: boolean ) {
    this._isDuplicate = value;
    this.markDirty();
  }
  get street1(): string | null {
    return this._street1;
  }
  set street1(value: string | null) {
    this._street1 = value;
    this.markDirty();
  }
  get street2(): string | null {
    return this._street2;
  }
  set street2(value: string | null) {
    this._street2 = value;
    this.markDirty();
  }
  get city(): string | null {
    return this._city;
  }
  set city(value: string | null) {
    this._city = value;
    this.markDirty();
  }
  get state(): string | null {
    return this._state;
  }
  set state(value: string | null) {
    this._state = value;
    this.markDirty();
  }
  get zip(): string | null {
    return this._zip;
  }
  set zip(value: string | null) {
    this._zip = value;
    this.markDirty();
  }
  get countryCode(): string | null {
    return this._countryCode;
  }
  set countryCode(value: string | null) {
    this._countryCode = value;
    this.markDirty();
  }
  get cspCode(): string | null{
    return this._cspCode;
  }
  set cspCode(value: string | null) {
    this._cspCode = value;
    this.markDirty();
  }
  get description(): string | null {
    return this._description;
  }
  set description(value: string | null) {
    this._description = value;
    this.markDirty();
  }
  get occupancy(): string | null {
    return this._occupancy;
  }
  set occupancy(value: string | null) {
    this._occupancy = value;
    this.markDirty();
  }
  get squareFeet(): number | null {
    return this._squareFeet;
  }
  set squareFeet(value: number | null) {
    this._squareFeet = value;
    this.markDirty();
    this.calculateITV();
  }
  get itv(): number | null {
    return this._itv;
  }
  set itv(value: number | null) {
    this._itv = value;
    this.markDirty();
  }
  get yearBuilt(): number | null {
    return this._yearBuilt;
  }
  set yearBuilt(value: number | null) {
    this._yearBuilt = value;
    this.markDirty();
  }
  get gutRehab(): number | null {
    return this._gutRehab;
  }
  set gutRehab(value: number | null) {
    this._gutRehab = value;
    this.markDirty();
  }
  get sprinklered(): number | null {
    return this._sprinklered;
  }
  set sprinklered(value: number | null) {
    this._sprinklered = value;
    this.markDirty();
  }
  get construction(): string | null {
    return this._construction;
  }
  set construction(value: string | null) {
    this._construction = value;
    this.markDirty();
  }
  get stories(): number | null {
    return this._stories;
  }
  set stories(value: number | null) {
    this._stories = value;
    this.markDirty();
  }
  get protectionClass(): number | null {
    return this._protectionClass;
  }
  set protectionClass(value: number | null) {
    this._protectionClass = value;
    this.markDirty();
  }
  get roof(): number | null {
    return this._roof;
  }
  set roof(value: number | null) {
    this._roof = value;
    this.markDirty();
  }
  get wiring(): number | null {
    return this._wiring;
  }
  set wiring(value: number | null) {
    this._wiring = value;
    this.markDirty();
  }
  get plumbing(): number | null {
    return this._plumbing;
  }
  set plumbing(value: number | null) {
    this._plumbing = value;
    this.markDirty();
  }
  get hvac(): number | null {
    return this._hvac;
  }
  set hvac(value: number | null) {
    this._hvac = value;
    this.markDirty();
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
      this.markDirty();
    }
    console.log('ITV' + this._itv);
  }

  constructor(building?: PropertyBuilding) {
    super();
  }
  baseOnGuidNewMatch(T: ParentBaseClass): void {
    this.isNew = false;
  }
  baseOnGuidUpdateMatch(T: ParentBaseClass): void {
    this.hasUpdate = false;
    this.isNew = false;
  }
  classValidation() {
    this.invalidList = [];
    this.canBeSaved = true;
    this.isValid = true;
    const settings: ErrorMessageSettings = {preventSave: true, tabAffinity: ValidationTypeEnum.Coverages, failValidation: true};
    this.errorMessagesList = this.validateChildren(this);

    if (this.emptyNumberValueCheck(this.subjectNumber)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Subject Number is required');
      this.createErrorMessage('Subject Number is required', settings);
    }
    if (this.emptyNumberValueCheck(this.premisesNumber)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Premises Number is required');
      this.createErrorMessage('Premises Number is required', settings);
    }
    if (this.emptyNumberValueCheck(this.buildingNumber)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Building Number is required');
      this.createErrorMessage('Building Number is required', settings);
    }
    if (this.emptyStringValueCheck(this.street1)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Street is required');
      this.createErrorMessage('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Street is required', settings);
    }
    if (this.emptyStringValueCheck(this.city)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' City is required');
      this.createErrorMessage('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' City is required', settings);
    }
    if (this.emptyStringValueCheck(this.state)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' State is required');
      this.createErrorMessage('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' State is required', settings);
    }
    if (this.emptyStringValueCheck(this.zip)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Zip is required');
      this.createErrorMessage('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Zip is required', settings);
    }
    if ((this.sprinklered ?? 0) > 100){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Sprinklered% mush be <= 100%');
      this.createErrorMessage('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Sprinklered% mush be <= 100%', settings);
    }
    if (this.isDuplicate){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' is duplicated');
      this.createErrorMessage('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' is duplicated', settings);
    }
    if (this.yearBuilt != null && (this.yearBuilt < 1000 || this.yearBuilt > 9999)) {
      this.isValid = false;
      this.invalidList.push('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Year Built is invalid');
      this.createErrorMessage('Building: ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?') + ' Year Built is invalid', settings);
    }
    if (this.emptyStringValueCheck(this.cspCode)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Csp Code for building ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?' + ' is required'));
      this.createErrorMessage('Csp Code for building ' + (this.subjectNumber ?? '?') + '-' + (this.premisesNumber ?? '?') + '-' + (this.buildingNumber ?? '?' + ' is required', settings));
    }
    if (this.emptyStringValueCheck(this.occupancy)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Occupancy is required');
      this.createErrorMessage('Occupancy is required', settings);
    }
    if (this.emptyStringValueCheck(this.construction)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Construction is required');
      this.createErrorMessage('Construction is required', settings);
    }
    if (this.emptyNumberValueCheck(this.yearBuilt)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Year Built is required');
      this.createErrorMessage('Year Built is required', settings);
    }
    if (this.itv == null || this.itv == undefined){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('ITV is required');
      this.createErrorMessage('ITV is required');
    }
    if (this.sprinklered == null || this.sprinklered == undefined){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Sprinkler is required');
      this.createErrorMessage('Sprinkler is required', settings);
    }
    if (this.emptyNumberValueCheck(this.squareFeet)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Square Feet is required');
      this.createErrorMessage('Square Feet is required', settings);
    }
    if (this.emptyNumberValueCheck(this.stories)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Stories is required');
      this.createErrorMessage('Stories is required', settings);
    }
    if (this.emptyNumberValueCheck(this.protectionClass)){
      this.canBeSaved = false;
      this.isValid = false;
      this.invalidList.push('Protection Class is required');
      this.createErrorMessage('Protection Class is required', settings);
    }
    this._errorMessages = this.invalidList;
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
    if (building.endorsementBuildingCoverage != null && building.endorsementBuildingCoverage.length > 0){
      building.endorsementBuildingCoverage.forEach(x => {
        const y = new PropertyPolicyBuildingCoverageClass(x);
        y.subjectNumber = building.subjectNumber;
        y.premisesNumber = building.premisesNumber;
        y.buildingNumber = building.buildingNumber;
        this.endorsementBuildingCoverage.push(y);
      });
      building.endorsementBuildingCoverage = this.endorsementBuildingCoverage;
    } else if (building.propertyQuoteBuildingCoverage != null && building.propertyQuoteBuildingCoverage.length > 0){
      building.propertyQuoteBuildingCoverage.forEach(x => {
        const y = new PropertyQuoteBuildingCoverageClass(x);
        y.subjectNumber = building.subjectNumber;
        y.premisesNumber = building.premisesNumber;
        y.buildingNumber = building.buildingNumber;
        this.propertyQuoteBuildingCoverage.push(y);
      });
    }
    this.propertyQuoteBuildingId = building.propertyQuoteBuildingId || 0;
    this.endorsementBuildingId = building.endorsementBuildingId || 0;
    this.propertyQuoteId = building.propertyQuoteId || 0;
    this.propertyPolicyId = building.propertyPolicyId || 0;
    this.taxCode = building.taxCode;
    this._subjectNumber = building.subjectNumber;
    this._premisesNumber = building.premisesNumber;
    this._buildingNumber = building.buildingNumber;
    this._street1 = building.street1;
    this._street2 = building.street2;
    this._city = building.city;
    this._state = building.state;
    this._zip = building.zip;
    this._countryCode = building.countryCode ?? 'USA';
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
    this.guid = building.guid || crypto.randomUUID();
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
    this.expand = true;
    this.isNew = true;
    this.markDirty();
    this.guid = crypto.randomUUID();
  }

  markClean() {
    this.isDirty = false;
  }
  markStructureClean(): void {
    this.markClean();
    this.markChildrenClean();
  }
  markDirty() {
    this.isDirty = true;
  }
  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }

  emptyNumberValueCheck(value: number | null | undefined) {
    return !value;
  }
  emptyStringValueCheck(value: string | null | undefined) {
    return !value;
  }
  get validateAddress(): boolean {
    return !(!this.street1 || !this.city || !this.zip);
  }

  baseToJSON() {
    const coverages: PropertyBuildingCoverage[] = [];
    this.propertyQuoteBuildingCoverage.forEach(c => coverages.push(c.toJSON()));

    const coverages2: PropertyBuildingCoverage[] = [];
    this.endorsementBuildingCoverage.forEach(c => coverages.push(c.toJSON()));

    return {
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
      endorsementBuildingCoverage: coverages2,
      guid: this.guid
    };
  }
}

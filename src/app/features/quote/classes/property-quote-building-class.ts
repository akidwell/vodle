import { PropertyBuilding } from '../models/property-building';
import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';


export class PropertyQuoteBuildingClass implements PropertyBuilding {
  propertyQuoteBuildingId: number | null = null;
  propertyQuoteId: number | null = null;
  propertyQuoteBuildingCoverage: PropertyQuoteBuildingCoverageClass[] = [];
  taxCode: string | null = null;

  private _locationNumber: number | null = null;
  private _buildingNumber: number | null = null;
  private _street1: string | null = null;
  private _street2: string | null = null;
  private _city: string | null = null;
  private _state: string | null = null;
  private _zip: string | null = null;
  private _countryCode: string | null = null;
  private _classCode: string | null = null;
  private _description: string | null = null;
  private _occupancy: string | null = null;
  private _yearBuilt: string | null = null;
  private _sprinklered: string | null = null;
  private _construction: string | null = null;
  private _stories: string | null = null;
  private _protectionClass: string | null = null;
  private _roof: string | null = null;
  private _wiring: string | null = null;
  private _plumbing: string | null = null;
  private _hvac: string | null = null;

  private _isDirty = false;
  isNew = false;
  invalidList: string[] = [];
  isZipLookup = false;
  isImport = false;

  get locationNumber(): number | null {
    return this._locationNumber;
  }
  set locationNumber(value: number | null) {
    this._locationNumber = value;
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
  get classCode(): string | null {
    return this._classCode;
  }
  set classCode(value: string | null) {
    this._classCode = value;
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
  get yearBuilt(): string | null {
    return this._yearBuilt;
  }
  set yearBuilt(value: string | null) {
    this._yearBuilt = value;
    this._isDirty = true;
  }
  get sprinklered(): string | null {
    return this._sprinklered;
  }
  set sprinklered(value: string | null) {
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
  get stories(): string | null {
    return this._stories;
  }
  set stories(value: string | null) {
    this._stories = value;
    this._isDirty = true;
  }
  get protectionClass(): string | null {
    return this._protectionClass;
  }
  set protectionClass(value: string | null) {
    this._protectionClass = value;
    this._isDirty = true;
  }
  get roof(): string | null {
    return this._roof;
  }
  set roof(value: string | null) {
    this._roof = value;
    this._isDirty = true;
  }
  get wiring(): string | null {
    return this._wiring;
  }
  set wiring(value: string | null) {
    this._wiring = value;
    this._isDirty = true;
  }
  get plumbing(): string | null {
    return this._plumbing;
  }
  set plumbing(value: string | null) {
    this._plumbing = value;
    this._isDirty = true;
  }
  get hvac(): string | null {
    return this._hvac;
  }
  set hvac(value: string | null) {
    this._hvac = value;
    this._isDirty = true;
  }

  get isDirty(): boolean {
    return this._isDirty;
  }
  get isValid(): boolean {
    const valid = true;
    //valid = this.validate(valid);
    return valid;
  }

  constructor(building?: PropertyBuilding) {
    if (building) {
      this.existingInit(building);
    } else {
      this.newInit();
    }
  }

  existingInit(building: PropertyBuilding) {
    this.propertyQuoteBuildingId = building.propertyQuoteBuildingId;
    this.propertyQuoteId = building.propertyQuoteId;
    this.taxCode = building.taxCode;
    this._locationNumber = building.locationNumber;
    this._buildingNumber = building.buildingNumber;
    this._street1 = building.street1;
    this._street2 = building.street2;
    this._city = building.city;
    this._state = building.state;
    this._zip = building.zip;
    this._countryCode = building.countryCode;
    this._classCode = building.classCode;
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

  locationNumberRequired = true;
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

  validate(valid: boolean): boolean {
    this.invalidList = [];
    // if (!this.validateAmount()) {
    //   valid = false;
    // }
    return valid;
  }
  get validateAddress(): boolean {
    return !(!this.street1 || !this.city);
  }
}
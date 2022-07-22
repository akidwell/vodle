
import { PropertyBuildingCoverage } from '../models/property-building-coverage';

export class PropertyQuoteCoverageClass implements PropertyBuildingCoverage {
  propertyQuoteCoverageId: number | null = null;
  propertyQuoteBuildingId: number | null = null;
  propertyCoverageId: number | null = null;
  isNew = false;
  private _subjectNumber: number | null = null;
  private _limit: number | null = null;
  private _coinsurancePct: number | null = null;
  private _causeOfLossId: number | null = null;
  private _valuationId: number | null = null;
  private _additionalDetail: string | null = null;

  get subjectNumber() : number | null {
    return this._subjectNumber;
  }
  set subjectNumber(value: number | null) {
    this._subjectNumber = value;
    this._isDirty = true;
  }
  get limit() : number | null {
    return this._limit;
  }
  set limit(value: number | null) {
    this._limit = value;
    this._isDirty = true;
  }
  get coinsurancePct() : number | null {
    return this._coinsurancePct;
  }
  set coinsurancePct(value: number | null) {
    this._coinsurancePct = value;
    this._isDirty = true;
  }
  get causeOfLossId() : number | null {
    return this._causeOfLossId;
  }
  set causeOfLossId(value: number | null) {
    this._causeOfLossId = value;
    this._isDirty = true;
  }
  get valuationId() : number | null {
    return this._valuationId;
  }
  set valuationId(value: number | null) {
    this._valuationId = value;
    this._isDirty = true;
  }
  get additionalDetail() : string | null {
    return this._additionalDetail;
  }
  set additionalDetail(value: string | null) {
    this._additionalDetail = value;
    this._isDirty = true;
  }

  private _isDirty = false;

  get isDirty() : boolean {
    return this._isDirty;
  }
  get isValid(): boolean {
    const valid = true;
    //valid = this.validate(valid);
    return valid;
  }

  constructor(coverage?: PropertyBuildingCoverage) {
    if (coverage) {
      this.existingInit(coverage);
    } else {
      this.newInit();
    }
  }

  existingInit(coverage: PropertyBuildingCoverage) {
    this.propertyQuoteCoverageId = coverage.propertyQuoteCoverageId;
    this.propertyQuoteBuildingId = coverage.propertyQuoteBuildingId;
    this.propertyCoverageId = coverage.propertyCoverageId;

    // this._subjectNumber = building.locationNumber;
    // this._limit = building.buildingNumber;
    // this._coinsurancePct = building.street1;
    // this._causeOfLossId = building.street2;
    // this._city = building.city;
    // this._state = building.state;
    // this._zip = building.zip;
    // this._countryCode = building.countryCode;
    // this._classCode = building.classCode;
    // this._description = building.description;
    // this._occupancy = building.occupancy;
    // this._yearBuilt = building.yearBuilt;
    // this._sprinklered = building.sprinklered;
    // this._construction = building.construction;
    // this._stories = building.stories;
    // this._protectionClass = building.protectionClass;
    // this._roof = building.roof;
    // this._wiring = building.wiring;
    // this._plumbing = building.plumbing;
    // this._hvac = building.hvac;

    
    this.setReadonlyFields();
    this.setRequiredFields();
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

}
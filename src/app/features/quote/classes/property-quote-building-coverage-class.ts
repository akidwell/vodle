
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { PropertyBuildingCoverage, PropertyBuildingCoverageData } from '../models/property-building-coverage';
import { QuoteValidation } from '../models/quote-validation';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';

export class PropertyQuoteBuildingCoverageClass implements PropertyBuildingCoverage {
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  propertyQuoteBuildingCoverageId = 0;
  propertyQuoteBuildingId = 0;
  isNew = false;
  isImport = false;
  focus = false;
  expand = false;
  subjectNumber: number | null = null;
  premisesNumber: number | null = null;
  buildingNumber: number | null = null;
  building!: PropertyQuoteBuildingClass;

  get buildingIndex(): string {
    return (this.subjectNumber ?? '') + '/' + (this.premisesNumber ?? '')+ '/' + (this.buildingNumber ?? '');
  }

  private _propertyCoverageId: number | null = null;
  private _limit: number | null = null;
  private _coinsurancePct: number | null = null;
  private _causeOfLossId: number | null = null;
  private _valuationId: number | null = null;
  private _additionalDetail: string | null = null;

  get propertyCoverageId() : number | null {
    return this._propertyCoverageId;
  }
  set propertyCoverageId(value: number | null) {
    this._propertyCoverageId = value;
    this.building?.calculateITV();
    this._isDirty = true;
  }

  get limit() : number | null {
    return this._limit;
  }
  set limit(value: number | null) {
    this._limit = value;
    this.building?.calculateITV();
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

  private currencyPipe = new CurrencyPipe('en-US');
  get limitFormatted(): string {
    const currency = this.currencyPipe.transform(this.limit, 'USD', 'symbol', '1.0-0');
    return currency ?? '';
  }
  private percentPipe = new PercentPipe('en-US');
  get coinsurancePctFormatted(): string {
    const percent = this.percentPipe.transform((this.coinsurancePct ?? 0) / 100);
    return percent ?? '';
  }
  get isDirty() : boolean {
    return this._isDirty;
  }
  get canBeSaved(): boolean {
    return this._canBeSaved;
  }
  get errorMessages(): string[] {
    return this._errorMessages;
  }
  get isValid(): boolean {
    return this._isValid;
  }

  constructor(coverage?: PropertyBuildingCoverageData) {
    if (coverage) {
      this.existingInit(coverage);
    } else {
      this.newInit();
    }
    this.validateClass();
  }
  validateClass() {
    if(this._validateOnLoad || this.isDirty) {
      //implement rules
      this._canBeSaved = true;
      this._isValid = true;
      this._errorMessages = ['property quote coverage'];
      this._validateOnLoad = false;
    }
  }

  existingInit(coverage: PropertyBuildingCoverageData) {
    this.propertyQuoteBuildingCoverageId = coverage.propertyQuoteBuildingCoverageId;
    this.propertyQuoteBuildingId = coverage.propertyQuoteBuildingId;
    this.propertyCoverageId = coverage.propertyCoverageId;
    this._limit = coverage.limit;
    this._coinsurancePct = coverage.coinsurancePct;
    this._causeOfLossId = coverage.causeOfLossId;
    this._valuationId = coverage.valuationId;
    this._additionalDetail = coverage.additionalDetail;

    this.setReadonlyFields();
    this.setRequiredFields();
  }

  // locationNumberRequired = true;
  // buildingNumberRequired = true;
  propertyCoverageIdRequired = true;
  coinsuranceRequired = true;
  causeOfLossIdRequired = true;
  valuationIdRequired = true;
  limitRequired = true;

  propertyCoverageIdReadonly = false;
  causeOfLossIdReadonly = false;
  valuationIdReadonly = false;

  newInit() {
    this.propertyQuoteBuildingCoverageId = 0;
    this.propertyQuoteBuildingId = 0;
    this.isNew = true;
    this.expand = true;
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

  toJSON() {
    return {
      propertyQuoteBuildingCoverageId: this.propertyQuoteBuildingCoverageId,
      propertyQuoteBuildingId: this.propertyQuoteBuildingId,
      propertyCoverageId: this.propertyCoverageId,
      limit: this.limit,
      coinsurancePct: this.coinsurancePct,
      causeOfLossId: this.causeOfLossId,
      valuationId: this.valuationId,
      additionalDetail: this.additionalDetail
    };
  }
}

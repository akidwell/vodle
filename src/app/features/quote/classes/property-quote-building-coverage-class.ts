
import { PropertyBuildingCoverage } from '../models/property-building-coverage';
import { QuoteValidation } from '../models/quote-validation';

export class PropertyQuoteBuildingCoverageClass implements PropertyBuildingCoverage {
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  propertyQuoteBuildingCoverageId: number | null = null;
  propertyQuoteBuildingId: number | null = null;
  propertyCoverageId: number | null = null;
  isNew = false;
  isImport = false;

  private _limit: number | null = null;
  private _coinsurancePct: number | null = null;
  private _causeOfLossId: number | null = null;
  private _valuationId: number | null = null;
  private _additionalDetail: string | null = null;

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

  constructor(coverage?: PropertyBuildingCoverage) {
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

  existingInit(coverage: PropertyBuildingCoverage) {
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


import { CurrencyPipe, PercentPipe } from '@angular/common';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { Validation } from 'src/app/shared/interfaces/validation';
import { PropertyBuildingCoverage, PropertyBuildingCoverageData } from '../models/property-building-coverage';
import { QuoteAfterSave } from '../models/quote-after-save';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';
import { QuoteValidationClass } from './quote-validation-class';

export class PropertyQuoteBuildingCoverageClass implements PropertyBuildingCoverage, Validation, QuoteAfterSave {
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;
  private _isDuplicate = false;

  propertyQuoteBuildingCoverageId = 0;
  propertyQuoteBuildingId = 0;
  isNew = false;
  guid = '';
  isImport = false;
  focus = false;
  expand = false;
  subjectNumber: number | null = null;
  premisesNumber: number | null = null;
  buildingNumber: number | null = null;
  building!: PropertyQuoteBuildingClass;
  invalidList: string[] = [];

  get buildingIndex(): string {
    return (this.subjectNumber ?? '') + '/' + (this.premisesNumber ?? '')+ '/' + (this.buildingNumber ?? '');
  }

  private _propertyCoverageId: number | null = null;
  private _limit: number | null = null;
  private _coinsuranceId: number | null = null;
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
  get coinsuranceId() : number | null {
    return this._coinsuranceId;
  }
  set coinsuranceId(value: number | null) {
    this._coinsuranceId = value;
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
  // private percentPipe = new PercentPipe('en-US');
  // get coinsurancePctFormatted(): string {
  //   const percent = this.percentPipe.transform((this.coinsurancePct ?? 0) / 100);
  //   return percent ?? '';
  // }
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

  constructor(coverage?: PropertyBuildingCoverageData) {
    if (coverage) {
      this.existingInit(coverage);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, null);
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

    if (this.isDuplicate){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Coverage: ' + this.propertyCoverageId + ' is duplicated on ' + (this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber).trim());
    }
    if ((this.limit ?? 0 ) > 9999999999){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Limit: ' + this.limitFormatted + ' exceeds maximum on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this._propertyCoverageId)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Property Coverage is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this._limit)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Limit is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this._coinsuranceId)){
      this._isValid = false;
      this.invalidList.push('Coinsurance is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this._causeOfLossId)){
      this._isValid = false;
      this.invalidList.push('Cause of Loss is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this._valuationId)){
      this._isValid = false;
      this.invalidList.push('Valuation is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    this._errorMessages = this.invalidList;
  }
  emptyNumberValueCheck(value: number | null | undefined) {
    return !value;
  }
  emptyStringValueCheck(value: string | null | undefined) {
    return !value;
  }

  existingInit(coverage: PropertyBuildingCoverageData) {
    this.propertyQuoteBuildingCoverageId = coverage.propertyQuoteBuildingCoverageId;
    this.propertyQuoteBuildingId = coverage.propertyQuoteBuildingId;
    this._propertyCoverageId = coverage.propertyCoverageId;
    this._limit = coverage.limit;
    this._coinsuranceId = coverage.coinsuranceId;
    this._causeOfLossId = coverage.causeOfLossId;
    this._valuationId = coverage.valuationId;
    this._additionalDetail = coverage.additionalDetail;

    this.setReadonlyFields();
    this.setRequiredFields();
  }

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
    this._isDirty = true;
    this.guid = crypto.randomUUID();
    this.expand = true;
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
      coinsuranceId: this.coinsuranceId,
      causeOfLossId: this.causeOfLossId,
      valuationId: this.valuationId,
      additionalDetail: this.additionalDetail,
      guid: this.guid
    };
  }
}

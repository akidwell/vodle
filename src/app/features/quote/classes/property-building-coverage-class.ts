import { CurrencyPipe } from '@angular/common';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { Validation } from 'src/app/shared/interfaces/validation';
import { PropertyBuildingCoverage } from '../models/property-building-coverage';
import { ChildBaseClass } from '../../policy-v2/classes/base/child-base-class';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';

export abstract class PropertyBuildingCoverageClass extends ChildBaseClass implements PropertyBuildingCoverage {

  propertyQuoteBuildingCoverageId = 0;
  propertyQuoteBuildingId = 0;
  endorsementBuildingId = 0;
  endorsementBuildingCoverageId = 0;

  isNew = false;
  guid = '';
  isImport = false;
  focus = false;
  expand = false;
  subjectNumber: number | null = null;
  premisesNumber: number | null = null;
  buildingNumber: number | null = null;
  invalidList: string[] = [];

  public _errorMessagesList: ErrorMessage[] = [];
  public _validateOnLoad = true;
  public _isDirty = false;
  public _isValid = true;
  public _canBeSaved = true;
  public _errorMessages: string[] = [];

  get buildingIndex(): string {
    return (this.subjectNumber ?? '') + '/' + (this.premisesNumber ?? '')+ '/' + (this.buildingNumber ?? '');
  }

  private _propertyCoverageId: number | null = null;
  private _limit: number | null = null;
  private _coinsuranceId: number | null = null;
  private _causeOfLossId: number | null = null;
  private _valuationId: number | null = null;
  private _additionalDetail: string | null = null;

  private _markForDeletion = false;
  get markForDeletion() : boolean {
    return this._markForDeletion;
  }
  set markForDeletion(value: boolean) {
    this._markForDeletion = value;
    console.log('in markdeletion', value);
    this.markDirty();
  }

  get propertyCoverageId() : number | null {
    return this._propertyCoverageId;
  }
  set propertyCoverageId(value: number | null) {
    this._propertyCoverageId = value;
    //this.building?.calculateITV();
    this.markDirty();
  }

  get limit() : number | null {
    return this._limit;
  }
  set limit(value: number | null) {
    this._limit = value;
    this.markDirty();
    console.log('in set limit' , value);
    console.log(this.isDirty);
  }
  get coinsuranceId() : number | null {
    return this._coinsuranceId;
  }
  set coinsuranceId(value: number | null) {
    this._coinsuranceId = value;
    this.markDirty();
  }
  get causeOfLossId() : number | null {
    return this._causeOfLossId;
  }
  set causeOfLossId(value: number | null) {
    this._causeOfLossId = value;
    this.markDirty();
  }
  get valuationId() : number | null {
    return this._valuationId;
  }
  set valuationId(value: number | null) {
    this._valuationId = value;
    this.markDirty();
  }
  get additionalDetail() : string | null {
    return this._additionalDetail;
  }
  set additionalDetail(value: string | null) {
    this._additionalDetail = value;
    this.markDirty();
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
  private _isDuplicate = false;
  get isDuplicate(): boolean {
    return this._isDuplicate;
  }
  set isDuplicate(value: boolean ) {
    this._isDuplicate = value;
    this.markDirty();
  }

  constructor(coverage?: PropertyBuildingCoverage) {
    super();
    if (coverage) {
      this.existingInit(coverage);
    } else {
      this.newInit();
    }
  }
  errorMessages: string[] = [];
  abstract validate(): Validation;

  classValidation() {
    this.invalidList = [];
    this.errorMessagesList = [];
    this.canBeSaved = true;
    this.isValid = true;

    if (this.isDuplicate){
      this.canBeSaved = false;
      this.isValid = false;
      this.createErrorMessage('Coverage: ' + this.propertyCoverageId + ' is duplicated on ' + (this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber).trim());
      this.invalidList.push('Coverage: ' + this.propertyCoverageId + ' is duplicated on ' + (this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber).trim());
    }
    if ((this.limit ?? 0 ) > 9999999999){
      this.canBeSaved = false;
      this.isValid = false;
      this.createErrorMessage('Limit: ' + this.limitFormatted + ' exceeds maximum on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
      this.invalidList.push('Limit: ' + this.limitFormatted + ' exceeds maximum on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this.propertyCoverageId)){
      this.canBeSaved = false;
      this.isValid = false;
      this.createErrorMessage('Property Coverage is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
      this.invalidList.push('Property Coverage is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this.limit)){
      this.canBeSaved = false;
      this.isValid = false;
      this.createErrorMessage('Limit is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
      this.invalidList.push('Limit is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this.coinsuranceId)){
      this.isValid = false;
      this.createErrorMessage('Coinsurance is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
      this.invalidList.push('Coinsurance is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this.causeOfLossId)){
      this.isValid = false;
      this.createErrorMessage('Cause of Loss is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
      this.invalidList.push('Cause of Loss is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this.valuationId)){
      this.isValid = false;
      this.createErrorMessage('Valuation is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
      this.invalidList.push('Valuation is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    this._errorMessages = this.invalidList;
    this.errorMessages = this.invalidList;
  }
  emptyNumberValueCheck(value: number | null | undefined) {
    return !value;
  }
  emptyStringValueCheck(value: string | null | undefined) {
    return !value;
  }

  existingInit(coverage: PropertyBuildingCoverage) {
    console.log('COVERAGE init' , coverage);
    this.endorsementBuildingId = coverage.endorsementBuildingId;
    this.endorsementBuildingCoverageId = coverage.endorsementBuildingCoverageId;
    this.propertyQuoteBuildingId = coverage.propertyQuoteBuildingId;
    this.propertyQuoteBuildingCoverageId = coverage.propertyQuoteBuildingCoverageId;
    this._propertyCoverageId = coverage.propertyCoverageId;
    this._limit = coverage.limit;
    this._coinsuranceId = coverage.coinsuranceId;
    this._causeOfLossId = coverage.causeOfLossId;
    this._valuationId = coverage.valuationId;
    this._additionalDetail = coverage.additionalDetail;
    this.guid = coverage.guid || crypto.randomUUID();
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
    this.isNew = true;
    this.guid = crypto.randomUUID();
    this.expand = true;
  }

  markStructureClean(): void {
    this.markClean();
  }

  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }

  toJSON(): PropertyBuildingCoverage {
    console.log(this, 'THIS');
    return {
      propertyQuoteBuildingCoverageId: this.propertyQuoteBuildingCoverageId,
      propertyQuoteBuildingId: this.propertyQuoteBuildingId,
      endorsementBuildingCoverageId: this.endorsementBuildingCoverageId,
      endorsementBuildingId: this.endorsementBuildingId,
      propertyCoverageId: this.propertyCoverageId,
      limit: this.limit,
      coinsuranceId: this.coinsuranceId,
      causeOfLossId: this.causeOfLossId,
      valuationId: this.valuationId,
      additionalDetail: this.additionalDetail,
      guid: this.guid,
      isNew: this.isNew,
      markForDeletion: this.markForDeletion
    };
  }
}

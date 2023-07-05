
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { Validation } from 'src/app/shared/interfaces/validation';
import { PropertyBuildingCoverage } from '../models/property-building-coverage';
import { QuoteAfterSave } from '../models/quote-after-save';
import { QuoteValidationClass } from './quote-validation-class';
import { PropertyBuildingCoverageClass } from './property-building-coverage-class';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { ChildBaseClass } from '../../policy-v2/classes/base/child-base-class';

export class PropertyQuoteBuildingCoverageClass extends PropertyBuildingCoverageClass implements Validation, QuoteAfterSave {
  validateObject(): ErrorMessage[] {
    return [];
  }
  onGuidNewMatch(T: ChildBaseClass): void {console.log('in guid new');}
  onGuidUpdateMatch(T: ChildBaseClass): void {console.log('in guid update');}
  public _validationResults: QuoteValidationClass;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;

  constructor(coverage?: PropertyBuildingCoverage) {
    super(coverage);
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
    if (this.emptyNumberValueCheck(this.propertyCoverageId)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Property Coverage is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this.limit)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Limit is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this.coinsuranceId)){
      this._isValid = false;
      this.invalidList.push('Coinsurance is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this.causeOfLossId)){
      this._isValid = false;
      this.invalidList.push('Cause of Loss is required on ' + this.subjectNumber + '-' + this.premisesNumber + '-' + this.buildingNumber);
    }
    if (this.emptyNumberValueCheck(this.valuationId)){
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

  existingInit(coverage: PropertyBuildingCoverage) {
    this.propertyQuoteBuildingCoverageId = coverage.propertyQuoteBuildingCoverageId;
    this.propertyQuoteBuildingId = coverage.propertyQuoteBuildingId;
    this.guid = coverage.guid;
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
    this.markDirty();
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

  toJSON() {
    return {
      propertyQuoteBuildingCoverageId: this.propertyQuoteBuildingCoverageId,
      propertyQuoteBuildingId: this.propertyQuoteBuildingId,
      endorsementBuildingId: this.endorsementBuildingId,
      propertPolicyBuildingCoverageId: this.propertPolicyBuildingCoverageId,
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


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

  get validationResults(): QuoteValidationClass {
    return this._validationResults;
  }

  onGuidNewMatch(T: ChildBaseClass): void {console.log('in guid new');}
  onGuidUpdateMatch(T: ChildBaseClass): void {console.log('in guid update');}
  public _validationResults: QuoteValidationClass;

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
  get buildingIndex(): string {
    return (this.subjectNumber ?? '') + '/' + (this.premisesNumber ?? '')+ '/' + (this.buildingNumber ?? '');
  }

  validate(){
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks
      this.classValidation();
      this.validationResults.errorMessages = this.invalidList;
      this._validateOnLoad = false;
    }
    this._validationResults.mapValues(this);
    console.log('vali results line 43',this);
    return this._validationResults;
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
      endorsementBuildingCoverageId: this.endorsementBuildingCoverageId,
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

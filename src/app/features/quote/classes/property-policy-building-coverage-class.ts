
import { CurrencyPipe } from '@angular/common';
import { PropertyBuildingCoverage } from '../models/property-building-coverage';
import { PolicyValidation } from 'src/app/shared/interfaces/policy-validation';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { PropertyBuildingCoverageClass } from './property-building-coverage-class';
import { Validation } from 'src/app/shared/interfaces/validation';
import { QuoteValidationClass } from './quote-validation-class';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';

export class PropertyPolicyBuildingCoverageClass extends PropertyBuildingCoverageClass implements PolicyValidation {
  validateObject(): ErrorMessage[] {
    this.classValidation();
    return this.errorMessagesList;
  }
  validate() {
    return new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.PropertyLocationCoverages);
  }

  endorsementBuildingCoverageId= 0;
  endorsementBuildingId= 0;
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
  invalidList: string[] = [];

  get buildingIndex(): string {
    return (this.subjectNumber ?? '') + '/' + (this.premisesNumber ?? '')+ '/' + (this.buildingNumber ?? '');
  }

  // private percentPipe = new PercentPipe('en-US');
  // get coinsurancePctFormatted(): string {
  //   const percent = this.percentPipe.transform((this.coinsurancePct ?? 0) / 100);
  //   return percent ?? '';
  // }

  constructor(coverage?: PropertyBuildingCoverage) {
    super();
    if (coverage) {
      this.existingInit(coverage);
    } else {
      this.newInit();
    }
  }
  onDelete(): void {
  }
  canEdit!: boolean;
  errorMessagesList!: ErrorMessage[];
  hasUpdate = false;
  id = 0;

  onSaveCompletion(T: PolicyValidation[]): void {
  }
  onGuidNewMatch(T: PropertyPolicyBuildingCoverageClass): void {
    this.endorsementBuildingCoverageId = T.endorsementBuildingCoverageId;
    this.endorsementBuildingId = T.endorsementBuildingId;
    this.isNew = false;
  }
  onGuidUpdateMatch(T: PolicyValidation): void {
  }

  emptyNumberValueCheck(value: number | null | undefined) {
    return !value;
  }
  emptyStringValueCheck(value: string | null | undefined) {
    return !value;
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
    this.isDirty = true;
    this.guid = crypto.randomUUID();
    this.expand = true;
  }
  markClean() {
    this.isDirty = false;
  }
  markStructureClean(): void {
    this.markClean();
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

  toJSON(): PropertyBuildingCoverage {
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

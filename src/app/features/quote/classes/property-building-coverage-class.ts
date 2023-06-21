
import { CurrencyPipe } from '@angular/common';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { Validation } from 'src/app/shared/interfaces/validation';
import { PropertyBuildingCoverage } from '../models/property-building-coverage';
import { QuoteAfterSave } from '../models/quote-after-save';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';
import { QuoteValidationClass } from './quote-validation-class';
import { ChildBaseClass } from '../../policy-v2/classes/base/child-base-class';

export abstract class PropertyBuildingCoverageClass extends ChildBaseClass implements PropertyBuildingCoverage, Validation, QuoteAfterSave {

  propertyQuoteBuildingCoverageId = 0;
  propertyQuoteBuildingId = 0;
  endorsementBuildingId = 0;
  propertPolicyBuildingCoverageId = 0;

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
    this.markDirty();
  }

  get limit() : number | null {
    return this._limit;
  }
  set limit(value: number | null) {
    this._limit = value;
    this.building?.calculateITV();
    this.building?.propertyQuote.calculateSubjectAmounts();
    this.building?.propertyQuote.calculateLargestPremTiv();
    this.building?.propertyQuote.calculateLargestExposure();
    this.building?.propertyQuote.calculateLawLimits();
    this.markDirty();
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
  validate?(): Validation {
    return new QuoteValidationClass(QuoteValidationTypeEnum.Child, null);

  }
  validationResults?: Validation | undefined;

  emptyNumberValueCheck(value: number | null | undefined) {
    return !value;
  }
  emptyStringValueCheck(value: string | null | undefined) {
    return !value;
  }

  existingInit(coverage: PropertyBuildingCoverage) {
    this.propertyQuoteBuildingCoverageId = coverage.propertyQuoteBuildingCoverageId;
    this.propertyQuoteBuildingId = coverage.propertyQuoteBuildingId;
    this._propertyCoverageId = coverage.propertyCoverageId;
    this._limit = coverage.limit;
    this._coinsuranceId = coverage.coinsuranceId;
    this._causeOfLossId = coverage.causeOfLossId;
    this._valuationId = coverage.valuationId;
    this._additionalDetail = coverage.additionalDetail;
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
    return {
      propertyQuoteBuildingCoverageId: this.propertyQuoteBuildingCoverageId,
      propertyQuoteBuildingId: this.propertyQuoteBuildingId,
      propertPolicyBuildingCoverageId: this.propertPolicyBuildingCoverageId,
      endorsementBuildingId: this.endorsementBuildingId,
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

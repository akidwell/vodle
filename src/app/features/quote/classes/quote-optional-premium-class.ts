import { deepClone } from 'src/app/core/utils/deep-clone';
import { OptionalPremiumClass } from 'src/app/shared/classes/optional-premium-class';
import { QuoteOptionalPremium } from '../models/quote-optional-premium';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { ChildBaseClass } from '../../policy-v2/classes/base/child-base-class';

export class QuoteOptionalPremiumClass extends OptionalPremiumClass {
  validateObject(): ErrorMessage[] {
    return this.errorMessagesList;
  }
  onGuidNewMatch(T: ChildBaseClass): void {
  }
  onGuidUpdateMatch(T: ChildBaseClass): void {
  }
  private _quoteId = 0;
  private _propertyQuoteBuildingOptionalCoverageId: number;
  private _isAccepted = true;
  private _isFlat = true;

  isImport!: boolean;

  constructor(optionalPremium?: QuoteOptionalPremium, quoteId?: number) {
    super(optionalPremium);
    this._quoteId = quoteId || 0;
    this._propertyQuoteBuildingOptionalCoverageId = optionalPremium ? optionalPremium.propertyQuoteBuildingOptionalCoverageId : 0;
    this._isAccepted = optionalPremium?.isAccepted ?? true;
    this._isFlat = optionalPremium?.isFlat ?? true;
  }

  get quoteId() : number {
    return this._quoteId;
  }

  set quoteId(value: number) {
    this._quoteId = value;
    this.markDirty();
  }

  set isAccepted(value: boolean) {
    this._isAccepted = value;
    this.markDirty();
  }
  get isAccepted() : boolean {
    return this._isAccepted;
  }

  set isFlat(value: boolean) {
    this._isFlat = value;
    this.markDirty();
  }
  get isFlat() : boolean {
    return this._isFlat;
  }

  get propertyQuoteBuildingOptionalCoverageId() : number {
    return this._propertyQuoteBuildingOptionalCoverageId;
  }

  set propertyQuoteBuildingOptionalCoverageId(value: number) {
    this._propertyQuoteBuildingOptionalCoverageId = value;
    this.markDirty();
  }
  classValidation() {
    this.invalidList = [];
    this.canBeSaved = true;

    this.validateLimit();
    this.validateBuilding();
    this.validateDeductible();
    this.validateDeductibleType();
    this.validateDeductibleCode();
    this.validateSubjectToMaxAmount();
    this.validateAdditionalDetail();
    this.validateAdditionalPremium();

    this.setErrorMessages();
  }
  copy(): QuoteOptionalPremium {
    const cloned = deepClone(this.toJSON());
    return cloned;
  }

  markImported() {
    this.isNew = true;
    this.isImport = true;
    this.guid = crypto.randomUUID();
  }
  toJSON(): QuoteOptionalPremium {
    return {
      propertyQuoteBuildingOptionalCoverageId: this._propertyQuoteBuildingOptionalCoverageId,
      buildingNumber: this.buildingNumber,
      premisesNumber: this.premisesNumber,
      isAppliedToAll: this.isAppliedToAll,
      quoteId: this._quoteId,
      limit: this.limit,
      deductible: this.deductible,
      deductibleCode: this.deductibleCode,
      deductibleType: this.deductibleType,
      additionalPremium: this.additionalPremium,
      coverageCode: this.coverageCode,
      isSubjectToMaxAmount: this.isSubjectToMaxAmount,
      subjectToMaxPercent: this.subjectToMaxPercent,
      isDeductibleSelected: this.isDeductibleSelected,
      isAccepted: this.isAccepted,
      isFlat: this.isFlat,
      additionalDetail: this.additionalDetail,
      guid: this.guid,
      isNew: this.isNew
    };
  }
}

import { deepClone } from 'src/app/core/utils/deep-clone';
import { OptionalPremiumClass } from 'src/app/shared/classes/optional-premium-class';
import { PolicyOptionalPremium, PolicyOptionalPremiumV2 } from '../../policy/models/policy-optional-premium';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { ChildBaseClass } from './base/child-base-class';

export class PolicyOptionalPremiumClassV2 extends OptionalPremiumClass {
  validateObject(): ErrorMessage[] {
    this.classValidation();
    return this.errorMessagesList;
  }
  onGuidNewMatch(T: ChildBaseClass): void {

  }
  onGuidUpdateMatch(T: ChildBaseClass): void {

  }
  _policyId = 0;
  _endorsementBuildingOptionalCoverageId: number;
  _isAccepted = true;
  _isFlat = true;

  isImport!: boolean;

  constructor(optionalPremium?: PolicyOptionalPremiumV2, quoteId?: number) {
    super(optionalPremium);
    this._policyId = quoteId || 0;
    this._endorsementBuildingOptionalCoverageId = optionalPremium ? optionalPremium.endorsementBuildingOptionalCoverageId : 0;
    this._isAccepted = optionalPremium?.isAccepted ?? true;
    this._isFlat = optionalPremium?.isFlat ?? true;
  }

  get policyId() : number {
    return this._policyId;
  }

  set policyId(value: number) {
    this._policyId = value;
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

  get endorsementBuildingOptionalCoverageId() : number {
    return this._endorsementBuildingOptionalCoverageId;
  }

  set endorsementBuildingOptionalCoverageId(value: number) {
    this._endorsementBuildingOptionalCoverageId = value;
    this.markDirty();
  }

  classValidation() {
    this.invalidList = [];
    this.errorMessagesList = [];
    this.canBeSaved = true;

    if(!this.markForDeletion){

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
  }
  copy(): PolicyOptionalPremium {
    const cloned = deepClone(this.toJSON());
    return cloned;
  }

  markImported() {
    this.isNew = true;
    this.isImport = true;
    this.guid = crypto.randomUUID();
  }
  toJSON(): PolicyOptionalPremiumV2 {
    return {
      endorsementBuildingOptionalCoverageId: this._endorsementBuildingOptionalCoverageId,
      policyId: this.policyId,
      buildingNumber: this.buildingNumber,
      premisesNumber: this.premisesNumber,
      isAppliedToAll: this.isAppliedToAll,
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
      isNew: this.isNew,
      markForDeletion: this.markForDeletion
    };
  }
}

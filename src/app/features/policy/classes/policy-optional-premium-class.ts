import { deepClone } from 'src/app/core/utils/deep-clone';
import { OptionalPremiumClass } from 'src/app/shared/classes/optional-premium-class';
import { PolicyOptionalPremium } from '../models/policy-optional-premium';

export class PolicyOptionalPremiumClass extends OptionalPremiumClass {
  private _policyId = 0;
  constructor(optionalPremium?: PolicyOptionalPremium) {
    super(optionalPremium);
    this._policyId = optionalPremium?.policyId || 0;
  }

  get policyId() : number {
    return this._policyId;
  }

  set policyId(value: number) {
    this._policyId = value;
    this.markDirty();
  }
  classValidation() {
    this.invalidList = [];
    this.canBeSaved = true;
    // if (!this.validateAmount()) {
    //   valid = false;
    // }

    this.errorMessages = this.invalidList;
    // this._canBeSaved = true;
    // this._isValid = true;
  }
  copy(): PolicyOptionalPremium {
    const cloned = deepClone(this.toJSON());
    return cloned;
  }
  toJSON(): PolicyOptionalPremium {
    return {
      buildingNumber: this.buildingNumber,
      premisesNumber: this.premisesNumber,
      isAppliedToAll: this.isAppliedToAll,
      policyId: this.policyId,
      limit: this.limit,
      deductible: this.deductible,
      deductibleCode: this.deductibleCode,
      deductibleType: this.deductibleType,
      additionalPremium: this.additionalPremium,
      coverageCode: this.coverageCode,
      isSubjectToMaxAmount: this.isSubjectToMaxAmount,
      subjectToMaxPercent: this.subjectToMaxPercent,
      isDeductibleSelected: this.isDeductibleSelected,
      additionalDetail: this.additionalDetail,
      guid: this.guid,
      isNew: this.isNew
    };
  }
}

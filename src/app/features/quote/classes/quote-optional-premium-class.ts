import { deepClone } from 'src/app/core/utils/deep-clone';
import { OptionalPremiumClass } from 'src/app/shared/classes/optional-premium-class';
import { QuoteOptionalPremium } from '../models/quote-optional-premium';

export class QuoteOptionalPremiumClass extends OptionalPremiumClass {
  private _propertyQuoteId = 0;

  constructor(optionalPremium?: QuoteOptionalPremium) {
    super(optionalPremium);
    this._propertyQuoteId = optionalPremium?.quoteId || 0;
  }

  get propertyQuoteId() : number {
    return this._propertyQuoteId;
  }

  set propertyQuoteId(value: number) {
    this._propertyQuoteId = value;
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
  copy(): QuoteOptionalPremium {
    const cloned = deepClone(this.toJSON());
    return cloned;
  }
  toJSON(): QuoteOptionalPremium {
    return {
      buildingNumber: this.buildingNumber,
      premisesNumber: this.premisesNumber,
      quoteId: this.propertyQuoteId,
      limit: this.limit,
      deductible: this.deductible,
      deductibleCode: this.deductibleCode,
      deductibleType: this.deductibleType,
      additionalPremium: this.additionalPremium,
      coverageCode: this.coverageCode,
      subjectToMaxAmount: this.subjectToMaxAmount,
      subjectToMaxPercent: this.subjectToMaxPercent,
      hasDeductible: this.hasDeductible,
      guid: this.guid,
      isNew: this.isNew
    };
  }
}

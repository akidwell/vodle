import { OptionalPremium } from 'src/app/shared/interfaces/optional-premium';

export interface PolicyOptionalPremium extends OptionalPremium {
  policyId: number;
}


export interface PolicyOptionalPremiumV2 extends OptionalPremium {
  policyId: number;
  endorsementBuildingOptionalCoverageId: number;
  isAccepted: boolean;
  isFlat: boolean;
}



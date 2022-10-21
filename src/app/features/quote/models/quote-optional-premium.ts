import { OptionalPremium } from 'src/app/shared/interfaces/optional-premium';

export interface QuoteOptionalPremium extends OptionalPremium {
  quoteId: number;
  propertyQuoteBuildingOptionalCoverageId: number;
  isAccepted: boolean;
}

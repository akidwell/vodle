
export interface MortgageeData {
  buildingNumber: string | null| undefined;
  attention: string | null;
  description: string | null;
  premisesNumber: number | null;
  mortgageHolder: string | null;
  propertyQuoteId: number | null;
  propertyQuoteMortgageeId: number | null;
  street1: string | null;
  street2: string | null;
  state: string | null;
  city: string | null;
  zip: string | null;
  countryCode: string | null;
  isAppliedToAll: boolean;
  isNew: boolean | null;
  }

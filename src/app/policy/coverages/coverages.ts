export interface EndorsementCoverage {
  coverageId: number;
  policyId: number;
  endorsementNumber: number;
  premium: number;
  subCode: number;
  limitsPattern: string;
  includeExclude: string;
  claimsMadeOrOccurrence: string;
  retroDate: number | null;
  locationId: number;
  premiumType: string;
  action: string;
  deductible: number;
  deductibleType: string;
  rateAmt: number;
  limitsPatternGroupCode: number;
  limit: number;
  coverageType: string;
  coverageCode: string;
  sequence: number;
  sir: number;
  glClassCode: number;
  classDescription: string;
  exposureCode: string;
  rateBasis: number;
  exposureBase: number;
  ecCollapsed: boolean;
  occurrenceOrClaimsMade: boolean | null;
}


export interface EndorsementCoverageLocation {
  locationId: number;
  policyId: number;
  street: string;
  city: string;
  state: string;
}

export interface EndorsementCoveragesGroup {
  coverages: EndorsementCoverage[];
  location: EndorsementCoverageLocation;
}

export interface EndorsementCoveragesResolved {
  endorsementCoveragesGroups: EndorsementCoveragesGroup[] | null;
  error?: any;
  }

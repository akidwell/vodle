export interface EndorsementCoverage {
  coverageId?: number | null;
  policyId: number;
  endorsementNumber: number;
  programId: number;
  premium: number;
  subCode: number;
  limitsPattern: string;
  includeExclude?: string | null;
  claimsMadeOrOccurrence: string;
  retroDate?: Date | null;
  locationId: number;
  premiumType: string;
  action: string;
  policySymbol: string;
  deductible?: number | null;
  deductibleType?: string | null;
  rateAmount: number;
  limitsPatternGroupCode: number;
  limit: number;
  coverageType: string;
  coverageCode: string;
  sequence: number;
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
  taxCode: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  county: string;
  zip: string;
}

export interface EndorsementCoveragesGroup {
  coverages: EndorsementCoverage[];
  location: EndorsementCoverageLocation;
}

export interface EndorsementCoveragesResolved {
  endorsementCoveragesGroups: EndorsementCoveragesGroup[] | null;
  error?: any;
  }

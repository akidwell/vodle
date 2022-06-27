export interface UnderlyingCoverage {
  policyId: number;
  endorsementNo: number;
  sequence: number;
  primaryCoverageCode?: number;
  limitsPatternGroupCode?: number;
  limitsPattern?: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  policyNumber?: string;
  carrierCode?: number;
  carrierName?: string;
  retroDate?: Date;
  label?: string;
  userDefinedCovDesc: string | null;
  comment: string | null;
  excessOfLimitsPattern?: string;
  underlyingScheduleLimitData: UnderlyingCoverageLimit[];
  isNew: boolean;
}


export interface UnderlyingCoverageLimit {
  policyId: number;
  endorsementNo: number;
  sequence: number;
  limitBasisCode: number;
  limit: number | null;
  limitDisplay: string;
  includeExclude: string | null;
  excess: number | null;
  excessDisplay: string;
  order: number;
  limitBasis: string;
  isUserAdded: boolean;
}

export interface UnderlyingLimitBasis {
  limitBasisCode: number;
  limitType: string;
  limitPurpose: string;
  limitBasis: string;
  limitAppliesTo: string;
  limitBasisDesc: string;
  order: number;
}
export interface UnderlyingCoveragesResolved {
  underlyingCoverages: UnderlyingCoverage[] | null;
  error?: any;
}

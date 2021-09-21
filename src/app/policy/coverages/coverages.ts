export interface EndorsementCoverage {
  coverageId: number;
  policyId: number;
  premium: number;
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
  sir: number;
  glClassCode: number;
  classDescription: string;
  exposureCode: string;
  rateBasis: number;
  exposureBase: number;
  ecCollapsed: boolean;
  occurrenceOrClaimsMade: boolean | null;
}
// export class EndorsementCoverage implements IEndorsementCoverage {
//   coverageId = 0;
//   policyId = 0;
//   premium = 0;
//   limitsPattern = '';
//   includeExclude = '';
//   claimsMadeOrOccurrence = '';
//   retroDate = Date.now();
//   locationId = 0;
//   premiumType = '';
//   action = '';
//   deductible = 0;
//   deductibleType = '';
//   rateAmt = 0;
//   limitsPatternGroupCode = 0;
//   sir = 0;
//   glClassCode = 0;
//   classDescription = '';
//   exposureCode = '';
//   rateBasis = 0;
//   exposureBase = 0;
//   ecCollapsed = true;
//   occurrenceOrClaimsMade = false;
// }

export interface EndorsementCoverageLocation {
  locationId: number;
}

export interface EndorsementCoveragesGroup {
  endorsementCoverages: EndorsementCoverage[];
  endorsementCoverageLocation: EndorsementCoverageLocation;
}

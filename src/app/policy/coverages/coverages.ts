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
  glClassCode?: number | null;
  classDescription: string;
  exposureCode: string;
  rateBasis?: number | null;
  exposureBase?: number | null;
  ecCollapsed: boolean;
  isFirst: boolean;
  isNew?: boolean;
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
  isNew: boolean;
}

export interface EndorsementCoveragesGroup {
  coverages: EndorsementCoverage[];
  location: EndorsementCoverageLocation;
}

export interface EndorsementCoveragesResolved {
  endorsementCoveragesGroups: EndorsementCoveragesGroup[] | null;
  error?: any;
  }


export const newEndorsementCoverage = (): EndorsementCoverage => ({
  sequence: 0,
  classDescription: '',
  coverageCode: '',
  coverageId: null,
  coverageType: '',
  action: 'A',
  claimsMadeOrOccurrence: 'O',
  deductible: 0,
  deductibleType: '',
  ecCollapsed: true,
  endorsementNumber: 0,
  exposureBase: null,
  exposureCode: '',
  glClassCode: null,
  includeExclude: '',
  limit: 0,
  limitsPattern: '',
  limitsPatternGroupCode: 0,
  locationId: 0,
  policyId: 0,
  policySymbol: '',
  premium: 0,
  premiumType: '',
  programId: 0,
  rateAmount: 0,
  rateBasis: null,
  retroDate: null,
  subCode: 0,
  isFirst: false,
  isNew: true
});

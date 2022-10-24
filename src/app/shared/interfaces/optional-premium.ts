export interface OptionalPremium {
  buildingNumber: number | null;
  premisesNumber: number | null;
  isAppliedToAll: boolean;
  coverageCode: number | null
  limit: number | null;
  subjectToMaxPercent: number | null;
  isSubjectToMaxAmount: boolean;
  isDeductibleSelected: boolean;
  deductible: number | null;
  deductibleType: string | null;
  deductibleCode: string | null;
  additionalPremium: number | null;
  additionalDetail: string;
  guid: string;
  isNew?: boolean;
}

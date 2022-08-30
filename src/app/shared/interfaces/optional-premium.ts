export interface OptionalPremium {
  buildingNumber: number | null;
  premisesNumber: number | null;
  coverageCode: number | null
  limit: number | null;
  subjectToMaxAmount: boolean;
  subjectToMaxPercent: number | null;
  hasDeductible: boolean;
  deductible: number | null;
  deductibleType: number | null;
  deductibleCode: number | null;
  additionalPremium: number | null;
  guid?: string;
  isNew?: boolean;
}

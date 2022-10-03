
export interface OptionalPremiumMapping {
  coverageCode: number;
  coverageName: string;
  coverageDescription: string;
  coverageDisplay: string;
  additionalDetailRequired: boolean;
  defaultDeductibleType: number;
  defaultDeductibleCode: number;
  subjectToMaxAmountAvailable: boolean;
  subjectToMaxAmountRequired: boolean;
  limitAvailable: boolean;
  limitRequired: boolean;
  deductibleRequired: boolean;
  additionalPremiumRequired: boolean;
}

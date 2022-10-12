
export interface OptionalPremiumMapping {
  coverageCode: number;
  coverageName: string;
  coverageDescription: string;
  coverageDisplay: string;
  additionalDetailRequired: boolean;
  subjectToMaxAmountAvailable: boolean;
  subjectToMaxAmountRequired: boolean;
  limitAvailable: boolean;
  limitRequired: boolean;
  deductibleRequired: boolean;
  deductibleAvailable: boolean;
  additionalPremiumRequired: boolean;
}

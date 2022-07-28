
export interface QuoteValidation {
  isValid: boolean;
  isDirty: boolean;
  canBeSaved: boolean;
  errorMessages: string[];
  validate?(): QuoteValidation;
}

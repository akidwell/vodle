export interface QuoteChildValidation {
  className: string;
  errorMessages: string[];
  isValid: boolean;
  isDirty: boolean;
  canBeSaved: boolean;
  isEmpty: boolean;
}

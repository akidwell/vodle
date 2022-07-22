import { QuoteChildValidation } from './quote-child-validation';

export interface QuoteValidation {
  isValid: boolean;
  isDirty: boolean;
  canBeSaved: boolean;
  isEmpty: boolean;
  childValidations: QuoteChildValidation[];
}

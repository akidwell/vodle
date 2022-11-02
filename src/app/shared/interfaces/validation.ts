
export interface Validation {
  isValid: boolean;
  isDirty: boolean;
  canBeSaved: boolean;
  errorMessages: string[];
  validationResults?: Validation;
  validate?(): Validation;
  markDirty?: () => void;
}

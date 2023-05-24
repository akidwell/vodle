import { ErrorMessage } from './errorMessage';

export interface PolicyValidation {
  canEdit: boolean;
  //isDirty functionality
  isDirty: boolean;
  markDirty(): void;
  markClean(): void;

  //validation functionality
  isValid: boolean;
  canBeSaved: boolean;
  errorMessages: ErrorMessage[];
  validationResults?: PolicyValidation;

  onSaveCompletion(T:PolicyValidation[]): void;
  onGuidNewMatch(T:PolicyValidation): void;
  onGuidUpdateMatch(T:PolicyValidation): void;
}

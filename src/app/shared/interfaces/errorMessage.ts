import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';

export interface ErrorMessage {
  tabAffinity: ValidationTypeEnum;
  message: string;
  preventSave: boolean;
  failValidation: boolean;
 }

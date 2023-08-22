import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { ValidationClass } from 'src/app/shared/classes/validation-class';
import { PolicyValidationTabNameEnum } from 'src/app/core/enums/policy-validation-tab-name-enum';

export class PolicyValidationClass extends ValidationClass {
  constructor(type: ValidationTypeEnum, tabName: PolicyValidationTabNameEnum | null){
    super(type, tabName);
  }

  nullCheck(value: string | number | boolean | null | undefined, fieldName: string) {
    if (!value) {
      const msg = fieldName + ' must have a value';
      this.isValid = false;
      this.errorMessages.push(msg);
    }
  }
  lessThanZeroCheck(value: number | null | undefined, fieldName: string) {
    if (value && value < 0) {
      const msg = fieldName + ' cannot be negative';
      this.isValid = false;
      this.errorMessages.push(msg);
    }
  }
}

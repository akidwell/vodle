import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { ValidationClass } from 'src/app/shared/classes/validation-class';
import { PolicyValidationTabNameEnum } from 'src/app/core/enums/policy-validation-tab-name-enum';

export class PolicyValidationClass extends ValidationClass {
  constructor(type: QuoteValidationTypeEnum, tabName: PolicyValidationTabNameEnum | null){
    super(type, tabName);
  }
}

import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { ValidationClass } from './validation-class';

export class TabValidationClass extends ValidationClass {
  constructor(tabName: QuoteValidationTabNameEnum | null) {
    super(QuoteValidationTypeEnum.Tab, tabName);
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

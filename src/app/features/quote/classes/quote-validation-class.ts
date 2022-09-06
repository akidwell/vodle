import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { ValidationClass } from 'src/app/shared/classes/validation-class';

export class QuoteValidationClass extends ValidationClass {
  constructor(type: QuoteValidationTypeEnum, tabName: QuoteValidationTabNameEnum | null){
    super(type, tabName);
  }

}

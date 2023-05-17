
import { PolicyValidationTabNameEnum } from 'src/app/core/enums/policy-validation-tab-name-enum';

export class PolicyValidationClass {
  isValid = false;
  isDirty = false;
  canBeSaved = false;
  errorMessages: string[] = [];
  markParentDirty?: () => void;
  isEmpty = false;
  tabName: PolicyValidationTabNameEnum | null = null;

  constructor(tabName: PolicyValidationTabNameEnum | null){
    this.isValid = true;
    this.isDirty = false;
    this.canBeSaved = true;
    this.errorMessages = [];
    this.isEmpty = false;
    this.tabName = tabName;
  }
}

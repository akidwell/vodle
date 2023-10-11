import { PolicyValidationTabNameEnum } from 'src/app/core/enums/policy-validation-tab-name-enum';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { PolicyValidation } from 'src/app/shared/interfaces/policy-validation';
import { Validation } from 'src/app/shared/interfaces/validation';

export interface ErrorMessageSettings {
  preventSave: boolean,
  failValidation: boolean,
  tabAffinity: ValidationTypeEnum,
}
export const errorMessageDefaults = {
  preventSave: true,
  failValidation: true,
  tabAffinity: ValidationTypeEnum.Tab
};

export abstract class ChildBaseClass implements PolicyValidation{
  isValid = true;
  _isDirty = false;
  _canBeSaved = true;
  isNew = false;
  hasUpdate = false;
  canEdit = true;
  id = 0;
  guid = '';
  errorMessagesList: ErrorMessage[] = [];

  //abstract methods need to be implemented in individual classes as each class will have different needs
  abstract validateObject(): ErrorMessage[];

  //The onGuidNewMatch is a hook for handling the results from a successful adding of a record
  //can be used to update ids or any other information
  //Needs the isNew flag to be set
  abstract onGuidNewMatch(T: ChildBaseClass): void;
  //The onGuidUpdateMatch hook allows us to trigger an update on an object by setting the hasUpdate flag in the response on a save
  //functionally works the same as onGuidNewMatch but we can differentiate between new/existing records
  abstract onGuidUpdateMatch(T: ChildBaseClass): void;

  get canBeSaved(): boolean {
    return this._canBeSaved;
  }
  set canBeSaved(value: boolean) {
    this._canBeSaved = value;
  }

  get isDirty() : boolean {
    return this._isDirty;
  }
  set isDirty(value: boolean) {
    this._isDirty = value;
  }


  markDirty(){
    this.isDirty = true;
  }
  markClean(){
    this.isDirty = false;
  }

  resetErrorMessages() {
    this.isValid = true;
    this.errorMessagesList = [];
  }

  onSaveCompletion(T:ChildBaseClass[]) {
    const match = T.find(c => c.guid && c.guid.length > 0 && c.guid == this.guid);
    console.log('CHILDBASECLASS' + T);
    if(this.isNew) {
      if (match) {
        this.onGuidNewMatch(match);
        this.isNew = false;
      }
    } else {
      if (match && match.hasUpdate) {
        this.onGuidUpdateMatch(match);
      }
    }
  }

  canSet() {
    return this.canEdit;
  }
  createErrorMessage(message: string, settings?: ErrorMessageSettings) {
    const errorMessage: ErrorMessage = {
      message: message,
      tabAffinity: settings?.tabAffinity ?? ValidationTypeEnum.Tab,
      failValidation: settings?.failValidation ?? false,
      preventSave: settings?.preventSave ?? false
    };
    this.errorMessagesList.push(errorMessage);
  }
}

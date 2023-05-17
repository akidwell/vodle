import { Validation } from 'src/app/shared/interfaces/validation';

export abstract class ChildBaseClass implements Validation{
  isValid = true;
  isDirty = false;
  canBeSaved = true;
  isNew = false;
  hasUpdate = false;
  canEdit = true;
  id = 0;
  guid = '';
  errorMessages: string[] = [];


  //abstract methods need to be implemented in individual classes as each class will have different needs
  abstract validate(): Validation;

  //The onGuidNewMatch is a hook for handling the results from a successful adding of a record
  //can be used to update ids or any other information
  //Needs the isNew flag to be set
  abstract onGuidNewMatch(T: ChildBaseClass): void;
  //The onGuidUpdateMatch hook allows us to trigger an update on an object by setting the hasUpdate flag in the response on a save
  //functionally works the same as onGuidNewMatch but we can differentiate between new/existing records
  abstract onGuidUpdateMatch(T: ChildBaseClass): void;

  markDirty(){
    this.isDirty = true;
  }
  markClean(){
    this.isDirty = false;
  }

  resetErrorMessages() {
    this.isValid = true;
    this.errorMessages = [];
  }

  onSaveCompletion(T:ChildBaseClass[]) {
    const match = T.find(c => c.guid && c.guid.length > 0 && c.guid == this.guid);
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

}

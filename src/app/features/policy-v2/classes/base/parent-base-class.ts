import { ChildBaseClass, ErrorMessageSettings, errorMessageDefaults } from './child-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { PolicyValidation } from 'src/app/shared/interfaces/policy-validation';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';

export abstract class ParentBaseClass implements PolicyValidation {
  isValid = true;
  public _isDirty = false;
  public _canBeSaved = true;
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
  abstract onGuidNewMatch(T: ParentBaseClass): void;
  //The onGuidUpdateMatch hook allows us to trigger an update on an object by setting the hasUpdate flag in the response on a save
  //functionally works the same as onGuidNewMatch but we can differentiate between new/existing records
  abstract onGuidUpdateMatch(T: ParentBaseClass): void;
  //Hook for having any children objects be deleted
  abstract onChildDeletion(child: Deletable): void;

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

  markClean(): void {
    this.isDirty = false;
    this.markChildrenClean(this);
  }
  markDirty(): void {
    this.isDirty = true;
  }

  resetErrorMessages() {
    this.isValid = true;
    this.errorMessagesList = [];
  }

  validateChildren<T extends ParentBaseClass>(parent: T): ErrorMessage[]{
    console.log(parent);
    let errorMessagesList: ErrorMessage[] = [];
    this.resetErrorMessages();
    Object.keys(parent).forEach(key => {
      const object = parent[key as keyof T];
      //console.log('key: ',key,'object: ', object);
      //Check to see if any property is of ChildBaseClass and validate
      console.log(object instanceof ChildBaseClass);
      if(object instanceof ChildBaseClass) {
        console.log('ChildBaseClass: ',object);
        errorMessagesList = errorMessagesList.concat(this.validateChildClass(object));
        console.log(errorMessagesList);
        this.isDirty = this.isDirty ? this.isDirty : object.isDirty;
        this.canBeSaved = this.canBeSaved ? this.canBeSaved: object.canBeSaved;
      }
      //Check to see if any property is of ParentBaseClass and validate itself and all children
      else if (object instanceof ParentBaseClass) {
        console.log('ParentBaseClass: ',object);
        errorMessagesList = errorMessagesList.concat(this.validateParentClass(object));
        this.isDirty = this.isDirty ? this.isDirty : object.isDirty;
      }
      //Check to see if property is an array and not empty
      else if (Array.isArray(object) && object.length > 0) {
        console.log('Array: ',object);
        object.forEach(objectInArray => {
          //Check to see if any property is of ChildBaseClass and validate
          if(objectInArray instanceof ChildBaseClass) {
            //console.log('ChildBaseClass Array: ',object);
            errorMessagesList = errorMessagesList.concat(this.validateChildClass(objectInArray));
            this.isDirty = this.isDirty ? this.isDirty : object.find(x => x.isDirty) ? true : false;
          }
          //Check to see if any property is of ParentBaseClass and validate itself and all children
          else if (objectInArray instanceof ParentBaseClass) {
            console.log('ParentBaseClass Array: ',object);
            errorMessagesList = errorMessagesList.concat(this.validateParentClass(objectInArray));
            this.isDirty = this.isDirty ? this.isDirty : object.find(x => x.isDirty) ? true : false;
          }
        });
      }

    });
    console.log(this.isDirty);
    console.log(errorMessagesList);
    return errorMessagesList;
  }
  //validate children classes that are of type ValidationChild (they will never have children classes needed to be validated)
  validateChildClass<T extends ChildBaseClass>(object:T): ErrorMessage[] {
    return object.validateObject();
  }
  //validate children classes that are of type ValidationParent (they could have children classes needing to be validated as well)
  validateParentClass<T extends ParentBaseClass>(object:T): ErrorMessage[] {
    return object.validateObject();
  }

  checkChildrenErrorMessages<T extends ParentBaseClass>(parent: T):ErrorMessage[] {
    let errorMessages: ErrorMessage[] = [];
    this.resetErrorMessages();
    Object.keys(parent).forEach(key => {
      const object = parent[key as keyof T];
      //console.log('key: ',key,'object: ', object);
      //Check to see if any property is of ChildBaseClass and validate
      if(object instanceof ChildBaseClass) {
        console.log('ChildBaseClass: ',object);
        errorMessages = errorMessages.concat(this.checkChildClassErrors(object));
      }
      //Check to see if any property is of ParentBaseClass and grab error messages from itself and all children
      else if (object instanceof ParentBaseClass) {
        console.log('ParentBaseClass: ',object);
        errorMessages = errorMessages.concat(this.checkParentClassErrors(object));
      }
      //Check to see if property is an array and not empty
      else if (Array.isArray(object) && object.length > 0) {
        console.log('Array: ',object);
        object.forEach(objectInArray => {
          //Check to see if any property is of ChildBaseClass and grab error messages
          if(objectInArray instanceof ChildBaseClass) {
            //console.log('ChildBaseClass Array: ',object);
            errorMessages = errorMessages.concat(this.checkChildClassErrors(objectInArray));
          }
          //Check to see if any property is of ParentBaseClass and grab error messages from itself and all children
          else if (objectInArray instanceof ParentBaseClass) {
            console.log('ParentBaseClass Array: ',object);
            errorMessages = errorMessages.concat(this.checkParentClassErrors(objectInArray));
          }
        });
      }

    });
    return errorMessages;
  }
  //bubble up all child class error messages
  checkChildClassErrors<T extends ChildBaseClass>(object:T): ErrorMessage[] {
    return object.errorMessagesList;
  }
  //bubble up all parent class error messages
  checkParentClassErrors<T extends ParentBaseClass>(object:T): ErrorMessage[] {
    return object.errorMessagesList;
  }
  markChildrenClean<T extends ParentBaseClass>(parent: T): void {
    Object.keys(parent).forEach(key => {
      const object = parent[key as keyof T];
      //Check to see if any property is of ValidationChildClass and mark as not dirty
      if(object instanceof ChildBaseClass) {
        object.markClean();
      }
      //Check to see if any property is of ValidationParentClass and mark itself and all children as not dirty
      else if (object instanceof ParentBaseClass) {
        object.markClean();
      }
      //Check to see if property is an array and not empty
      else if (Array.isArray(object) && object.length > 0) {
        object.forEach(objectInArray => {
          //Check to see if any property is of ValidationChildClass and mark as not dirty
          if(objectInArray instanceof ChildBaseClass) {
            objectInArray.markClean();
          }
          //Check to see if any property is of ValidationParentClass and mark itself and all children as not dirty
          else if (objectInArray instanceof ParentBaseClass) {
            objectInArray.markClean();
          }
        });
      }

    });
  }

  //Will remove any isNew flags and look for guid matches
  updateChildrenOnSaveCompletion<T extends ParentBaseClass>(parent: T, savedArray: T[]): void {
    //we match the parent object with the saved version
    const saved = savedArray.find(x => x.id == this.id);
    console.log(saved, savedArray);
    if (!saved) {
      return;
    }
    //loop through all the property keys and look for any instances of Validation based classes
    Object.keys(parent).forEach(key => {
      const object = parent[key as keyof T];
      const savedObject = saved[key as keyof T];
      console.log('KEYS:' +Object.keys(parent));
      //Check to see if any property is of ValidationChildClass and mark as not dirty
      if(object instanceof ChildBaseClass && savedObject instanceof ChildBaseClass) {
        //need to convert single object to array
        const savedArray = [savedObject];
        object.onSaveCompletion(savedArray);
      }
      //Check to see if any property is of ValidationParentClass and mark itself and all children as not dirty
      else if (object instanceof ParentBaseClass && savedObject instanceof ParentBaseClass) {
        const savedArray = [savedObject];
        object.onSaveCompletion(savedArray);
      }
      //Check to see if property is an array and not empty
      else if (Array.isArray(object) && object.length > 0 && Array.isArray(savedObject) && savedObject.length > 0) {
        object.forEach((objectInArray) => {
          //Check to see if any property is of ValidationChildClass and mark as not dirty
          if(objectInArray instanceof ChildBaseClass) {
            if (savedObject[0] instanceof ChildBaseClass) {
              objectInArray.onSaveCompletion(savedObject);
            }
          }
          //Check to see if any property is of ValidationParentClass and mark itself and all children as not dirty
          else if (objectInArray instanceof ParentBaseClass) {
            if (savedObject[0] instanceof ParentBaseClass) {
              objectInArray.onSaveCompletion(savedObject);
            }
          }
        });
      }

    });
  }
  //Will call the onChildDeletion hook for any parent with children items with the markForDeletion flag
  //Will also call the onDelete hook for any children being deleted
  checkForChildDeletions<T extends ParentBaseClass>(parent: T): void {

    //loop through all the property keys and look for any instances of Validation based classes
    Object.keys(parent).forEach(key => {
      const object = parent[key as keyof T];
      if (Array.isArray(object) && object.length > 0) {
        object.forEach((objectInArray, index) => {
          //Check to see if any property has the Deletable interface and marked for deletion
          if(this.checkIfDeleted(objectInArray)) {
            this.onChildDeletion(objectInArray);
            objectInArray.onDelete();
            object.splice(index, 1);
          }
        });
      }
    });
  }

  //T will be all saved instances of this objects class in an array
  //for the parent level quote or policy object it will only have item in the array
  onSaveCompletion(T:ParentBaseClass[]) {
    console.log('T:' +T);
    const match = T.find(c => c.guid && c.guid.length > 0 && c.guid == this.guid);
    if(this.isNew) {
      if (match) {
        this.onGuidNewMatch(match);
        this.isNew = false;
        this.isDirty = false;
      }
    } else {
      if (match && match.hasUpdate) {
        this.onGuidUpdateMatch(match);
      }
    }
    this.checkForChildDeletions(this);
    this.updateChildrenOnSaveCompletion(this, T);
  }

  canSet() {
    return this.canEdit;
  }

  //Will determine if the object has the Deletable interface and if it is marked for deletion
  checkIfDeleted<T>(deletable: T) {
    console.log('DELETEBAE:' + deletable);
    return (deletable as Deletable).markForDeletion === true;
  }
  createErrorMessage(message: string, errorMessageSettings?: ErrorMessageSettings) {
    const errorMessage: ErrorMessage = {
      message: message,
      tabAffinity: errorMessageSettings?.tabAffinity ?? ValidationTypeEnum.Tab,
      failValidation: errorMessageSettings?.failValidation ?? false,
      preventSave: errorMessageSettings?.preventSave ?? false
    };
    this.errorMessagesList.push(errorMessage);
  }
}

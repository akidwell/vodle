import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationClass } from 'src/app/features/quote/classes/quote-validation-class';
import { QuoteAfterSave } from 'src/app/features/quote/models/quote-after-save';
import { InternalNotes } from '../interfaces/internal-notes';
import { Validation } from '../interfaces/validation';

export abstract class InternalNotesClass implements InternalNotes, Validation, QuoteAfterSave{
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;
  private _note: string | null = null;


  invalidList: string[] = [];

  noteId: number | null = null;
  quoteId: number | null = null;
  createdDate: Date | null = null;
  createdByName: string | null = null;
  createdBy: number | null = null;
  isNew: any;

  constructor(notes?: InternalNotes){
    if (notes) {
      this.existingInit(notes);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.TermsAndConditions);
    this.validate();
  }

  get note() : string | null {
    return this._note;
  }
  set note(value: string | null) {
    this._note = value;
  }

  get validationResults(): QuoteValidationClass {
    return this._validationResults;
  }
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

  get isValid(): boolean {
    return this._isValid;
  }
  set isValid(value: boolean){
    this._isValid = value;
  }

  get errorMessages(): string[] {
    return this._errorMessages;
  }
  set errorMessages(value: string[]){
    this._errorMessages = value;
  }

  existingInit(sub: InternalNotes){
    this.quoteId = sub.quoteId;
    this.noteId = sub.noteId;
    this.note = sub.note;
    this.createdBy = sub.createdBy;
    this.createdDate = sub.createdDate;
    this.createdByName = sub.createdByName;
  }

  newInit() {
    this.isDirty = true;
  }

  validate(){
    this._validationResults.resetValidation();
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks
      this.classValidation();
      this._validateOnLoad = false;
      console.log(this._canBeSaved);
    }
    this._validationResults.mapValues(this);
    return this._validationResults;
  }

    abstract classValidation(): void;

    markClean() {
      this._isDirty = false;
    }
    markStructureClean(): void {
      this.markClean();
    }
    markDirty() {
      this._isDirty = true;
    }
    abstract toJSON(): InternalNotes;
}

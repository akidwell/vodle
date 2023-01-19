import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationClass } from 'src/app/features/quote/classes/quote-validation-class';
import { QuoteAfterSave } from 'src/app/features/quote/models/quote-after-save';
import { GeneralRemarks } from '../interfaces/general-remarks';
import { Validation } from '../interfaces/validation';

export abstract class GeneralRemarksClass implements GeneralRemarks, Validation, QuoteAfterSave{
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;
  private _remark: string | null = null;


  invalidList: string[] = [];

  remarkId: number | null = null;
  quoteId: number | null = null;
  sortSequence: number | null = null;
  isNew: any;

  constructor(disclaimers?: GeneralRemarks){
    if (disclaimers) {
      this.existingInit(disclaimers);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.TermsAndConditions);
    this.validate();
  }

  get remark() : string | null {
    return this._remark;
  }
  set remark(value: string | null) {
    this._remark = value;
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

  existingInit(sub: GeneralRemarks){
    this.quoteId = sub.quoteId;
    this.remarkId = sub.remarkId;
    this.remark = sub.remark;
    this.sortSequence = sub.sortSequence;
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
    abstract toJSON(): GeneralRemarks;
}

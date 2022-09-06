import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { Validation } from 'src/app/shared/interfaces/validation';
import { QuoteAfterSave } from '../models/quote-after-save';
import { QuoteLineItem } from '../models/quote-line-item';
import { QuoteValidationClass } from './quote-validation-class';

export class QuoteLineItemClass implements QuoteLineItem, Validation, QuoteAfterSave {
  private _isValid = true;
  private _isDirty = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  private _sequence: number | null = 0;
  private _amount: number | null = null;
  private _dueDate: Date | null = null;
  private _ysnReceived: boolean | null= null;
  private _lineItemCode: number | null= null;
  private _notes: string | null = null;

  invalidList: string[] = [];
  quoteId: number | null = null;
  isNew = false;
  isCopy = false;


  get sequence() : number | null {
    return this._sequence;
  }
  set sequence(value: number | null) {
    this._sequence = value;
    this._isDirty = true;
  }

  get amount() : number | null {
    return this._amount;
  }
  set amount(value: number | null) {
    this._amount = value;
    this._isDirty = true;
  }

  get dueDate() : Date | null {
    return this._dueDate;
  }
  set dueDate(value: Date | null) {
    this._dueDate = value;
    this._isDirty = true;
  }

  get ysnReceived(): boolean | null {
    return this._ysnReceived;
  }
  set ysnReceived(value: boolean | null) {
    this._ysnReceived = value;
    this._isDirty = true;
  }

  get lineItemCode(): number | null {
    return this._lineItemCode;
  }
  set lineItemCode(value: number | null) {
    this._lineItemCode = value;
    this._isDirty = true;
  }

  get notes(): string | null {
    return this._notes;
  }
  set notes(value: string | null) {
    this._notes = value;
    this._isDirty = true;
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
  constructor(lineItem?: QuoteLineItem) {
    if (lineItem) {
      this.existingInit(lineItem);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.CoveragePremium);
    this.validate();
  }
  validate(){
    if (this._validateOnLoad || this.isDirty){
      this.classValidation();
      this._validateOnLoad = false;
    }
    this._validationResults.resetValidation();
    this._validationResults.mapValues(this);
    return this._validationResults;
  }
  classValidation() {
    this.invalidList = [];
    this._canBeSaved = true;

    this._errorMessages = this.invalidList;
  }
  existingInit(lineItem: QuoteLineItem) {
    this.quoteId = lineItem.quoteId;
    this.sequence = lineItem.sequence;
    this.amount = lineItem.amount;
    this.dueDate = lineItem.dueDate;
    this.ysnReceived = lineItem.ysnReceived;
    this.lineItemCode = lineItem.lineItemCode;

    this.setReadonlyFields();
    this.setRequiredFields();
  }

  newInit() {
    this.ysnReceived = false;
  }

  markClean() {
    this._isDirty = false;
  }
  markStructureClean(): void {
    this.markClean();
  }
  markDirty() {
    this._isDirty = true;
  }
  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }

  toJSON() {
    return {
      quoteId: this.quoteId,
      sequence: this.sequence,
      amount: this.amount,
      dueDate: this.dueDate,
      ysnReceived: this.ysnReceived,
      lineItemCode: this.lineItemCode,
      notes: this.notes
    };
  }

}

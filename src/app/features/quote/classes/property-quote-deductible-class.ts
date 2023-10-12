import { Validation } from 'src/app/shared/interfaces/validation';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { PropertyDeductible, PropertyQuoteDeductible } from '../models/property-deductible';
import { QuoteAfterSave } from '../models/quote-after-save';
import { QuoteValidationClass } from './quote-validation-class';
import { BuildingLocationClass } from 'src/app/shared/classes/building-location-class';

export class PropertyQuoteDeductibleClass extends BuildingLocationClass implements Validation, QuoteAfterSave {
  private _isDirty = false;
  private _isValid = true;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;
  private _isDuplicate = false;
  private _markForDeletion: boolean | null = null;
  propertyQuoteDeductibleId: number | null = null;
  propertyQuoteId: number | null = null;
  sequence: number | null = null;
  isDeductibleLocked = false;
  isDeductibleTypeLocked = false;
  isExcludeLocked = false;
  isSubjectToMinLocked = false;

  private _propertyDeductibleId: number | null = null;
  private _deductibleType: string | null = null;
  private _amount: number | null = null;
  private _subjectToMinPercent: number | null = null;
  private _subjectToMinAmount: number | null = null;
  private _deductibleCode: string | null = null;
  private _comment: string | null = null;
  private _isExcluded = false;
  private _isSubjectToMin: boolean | null = null;
  isNew = false;
  guid = '';
  invalidList: string[] = [];

  get markForDeletion() : boolean | null {
    return this._markForDeletion;
  }
  set markForDeletion(value: boolean | null){
    this._markForDeletion = value;
    this._isDirty = true;
  }

  get propertyDeductibleId() : number | null {
    return this._propertyDeductibleId;
  }
  set propertyDeductibleId(value: number | null) {
    this._propertyDeductibleId = value;
    this._isDirty = true;
  }
  get deductibleType() : string | null {
    return this._deductibleType;
  }
  set deductibleType(value: string | null) {
    this._deductibleType = value;
    this._isDirty = true;
  }
  get deductibleCode() : string | null {
    return this._deductibleCode;
  }
  set deductibleCode(value: string | null) {
    this._deductibleCode = value;
    this._isDirty = true;
  }
  get subjectToMinPercent() : number | null {
    return this._subjectToMinPercent;
  }
  set subjectToMinPercent(value: number | null) {
    this._subjectToMinPercent = value;
    this._isDirty = true;
  }
  get subjectToMinAmount() : number | null {
    return this._subjectToMinAmount;
  }
  set subjectToMinAmount(value: number | null) {
    this._subjectToMinAmount = value;
    this._isDirty = true;
  }
  get amount() : number | null {
    return this._amount;
  }
  set amount(value: number | null) {
    this._amount = value;
    this._isDirty = true;
  }
  get comment() : string | null {
    return this._comment;
  }
  set comment(value: string | null) {
    this._comment = value;
    this._isDirty = true;
  }
  get isExcluded() : boolean {
    return this._isExcluded;
  }
  set isExcluded(value: boolean) {
    this._isExcluded = value;
    if (this._isExcluded) {
      this.amount = null;
      this.deductibleType = null;
      this.subjectToMinPercent = null;
      this.subjectToMinAmount = null;
      this.isSubjectToMin = false;
      this.deductibleCode = null;
    }
    this._isDirty = true;
  }
  get isSubjectToMin() : boolean | null {
    return this._isSubjectToMin;
  }
  set isSubjectToMin(value: boolean | null) {
    this._isSubjectToMin = value;
    if (this._isSubjectToMin) {
      this.amount = null;
      this.subjectToMinPercent = null;
      this.subjectToMinAmount = null;
    }
    this._isDirty = true;
  }

  get isDirty() : boolean {
    return this._isDirty;
  }
  set isDirty(value: boolean ) {
    this._isDirty = value;
  }
  get canBeSaved(): boolean {
    return this._canBeSaved;
  }
  get errorMessages(): string[] {
    return this._errorMessages;
  }
  set errorMessages(value: string[]){
    this._errorMessages = value;
  }

  get isValid(): boolean {
    return this._isValid;
  }
  get validationResults(): QuoteValidationClass {
    return this._validationResults;
  }
  get isDuplicate(): boolean {
    return this._isDuplicate;
  }
  set isDuplicate(value: boolean ) {
    this._isDuplicate = value;
    this._isDirty = true;
  }

  constructor(deductible?: PropertyQuoteDeductible) {
    super();
    if (deductible) {
      this.existingInit(deductible);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(ValidationTypeEnum.Child, QuoteValidationTabNameEnum.CoveragePremium);
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

    if (!this.isAppliedToAll && (this.emptyNumberValueCheck(this.premisesNumber) || this.emptyNumberValueCheck(this.buildingNumber))) {
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Premises/Building Number is required');
    }

    if (this.emptyNumberValueCheck(this._propertyDeductibleId)){
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Deductible is required');
    }
    if (this.isDuplicate){
      this._canBeSaved = false;
      this._isValid = false;
      if (this.isAppliedToAll) {
        this.invalidList.push('Deductible: ' + this.propertyDeductibleId + ' is duplicated on All');
      }
      else {
        this.invalidList.push('Deductible: ' + this.propertyDeductibleId + ' is duplicated on ' + this.premisesNumber + '-' + this.buildingNumber);
      }
    }
    if (this.validateAmount()) {
      this._isValid = false;
      //this._canBeSaved = false;
    }
    if (this.validateDeductibleType()) {
      this._isValid = false;
      //this._canBeSaved = false;
    }
    if (this.validateDeductibleCode()) {
      this._isValid = false;
      //this._canBeSaved = false;
    }
    if (this.validateSubjectToMinPercent()) {
      this._isValid = false;
      //this._canBeSaved = false;
    }
    if (this.validateSubjectToMinAmount()) {
      this._isValid = false;
      //this._canBeSaved = false;
    }
    this.errorMessages = this.invalidList;
  }

  validateAmount(): boolean {
    let invalid = false;
    if ((!this.isExcluded && !this.isSubjectToMin) && (this.amount ?? 0) == 0) {
      invalid = true;
      this.invalidList.push('Deductible Amount is required');
    }
    return invalid;
  }

  validateDeductibleType(): boolean {
    let invalid = false;
    if (!this.isExcluded && !this._deductibleType) {
      invalid = true;
      this.invalidList.push('Deductible Type is required');
    }
    return invalid;
  }

  validateDeductibleCode(): boolean {
    let invalid = false;
    if (!this.isExcluded && !this._deductibleCode) {
      invalid = true;
      this.invalidList.push('Deductible Code is required');
    }
    if(this.propertyDeductibleId == 1 && this.deductibleType == 'C' ){
      invalid = true;
      this.invalidList.push('Deductible Code for AOP should be Per Occurence');
    }

    return invalid;
  }

  validateSubjectToMinPercent(): boolean {
    let invalid = false;
    if (this.isSubjectToMin && !this._subjectToMinPercent) {
      invalid = true;
      this.invalidList.push('Subject to Min Percent is required');
    }
    return invalid;
  }

  validateSubjectToMinAmount(): boolean {
    let invalid = false;
    if (this.isSubjectToMin && (this._subjectToMinAmount ?? 0) == 0) {
      invalid = true;
      this.invalidList.push('Subject to Min Amount is required');
    }
    return invalid;
  }

  emptyNumberValueCheck(value: number | null | undefined) {
    return !value;
  }
  emptyStringValueCheck(value: string | null | undefined) {
    return !value;
  }

  existingInit(deductible: PropertyQuoteDeductible) {
    this.propertyQuoteDeductibleId = deductible.propertyQuoteDeductibleId;
    this.propertyQuoteId = deductible.propertyQuoteId;
    this.sequence = deductible.sequence;
    this.isAppliedToAll = deductible.isAppliedToAll;
    this.premisesNumber = deductible.premisesNumber;
    this.buildingNumber = deductible.buildingNumber;
    this._propertyDeductibleId = deductible.propertyDeductibleId;
    this._deductibleType = deductible.deductibleType;
    this._amount = deductible.amount;
    this._subjectToMinPercent = deductible.subjectToMinPercent;
    this._subjectToMinAmount = deductible.subjectToMinAmount;
    this._deductibleCode = deductible.deductibleCode;
    this._comment = deductible.comment;
    this._isExcluded = deductible.isExcluded;
    this._isSubjectToMin = deductible.isSubjectToMin;
    this.isDeductibleLocked = deductible.isDeductibleLocked;
    this.isDeductibleTypeLocked = deductible.isDeductibleTypeLocked;
    this.isExcludeLocked = deductible.isExcludeLocked;
    this.isSubjectToMinLocked = deductible.isSubjectToMinLocked;
    this.guid = deductible.guid;
    this.setReadonlyFields();
    this.setRequiredFields();
  }

  newInit() {
    this.propertyQuoteDeductibleId = 0;
    this.propertyQuoteId = 0;
    this.isExcluded = false;
    this.isSubjectToMin = false;
    this.isNew = true;
    this.guid = crypto.randomUUID();
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
      propertyQuoteDeductibleId: this.propertyQuoteDeductibleId,
      propertyQuoteId: this.propertyQuoteId,
      propertyDeductibleId: this.propertyDeductibleId,
      isAppliedToAll: this.isAppliedToAll,
      premisesNumber: this.premisesNumber,
      buildingNumber: this.buildingNumber,
      sequence: this.sequence,
      deductibleType: this.deductibleType,
      deductibleCode: this.deductibleCode,
      comment: this.comment,
      amount: this.amount,
      subjectToMinPercent: this.subjectToMinPercent,
      subjectToMinAmount: this.subjectToMinAmount,
      isExcluded: this.isExcluded,
      isSubjectToMin: this.isSubjectToMin,
      isDeductibleLocked: this.isDeductibleLocked,
      isDeductibleTypeLocked: this.isDeductibleTypeLocked,
      isExcludeLocked: this.isExcludeLocked,
      isSubjectToMinLocked: this.isSubjectToMinLocked,
      isNew: this.isNew,
      guid: this.guid,
      isDirty: this.isDirty,
      building: null,
      markForDeletion: this.markForDeletion,
      validate: () => null
      // deleteVisible: false,
      // subjectToMinAmountRequired: false,
      // subjectToMinVisible: false,
      // subjectToMinPercentRequired: false,
      // isSubjectToMinVisible: false,
      // isExcludedReadonly: false,
      // isExcludedVisible: false,
      // deductibleCodeRequired: false,
      // deductibleTypeReadonly: false,
      // deductibleTypeRequired: false,
      // amountRequired: false,
      // amountReadonly: false,
      // deductibleReadonly: false,
      // deductibleRequired: false,
      // markDirty: () => null
    };
  }
}

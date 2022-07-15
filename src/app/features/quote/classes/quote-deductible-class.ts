import { PropertyQuoteDeductible } from '../models/property-quote-deductible';

export class QuoteDeductibleClass implements PropertyQuoteDeductible {
  propertyQuoteDeductibleId = 1;
  propertyQuoteId = 1;

  private _propertyDeductibleId: number | null = null;
  private _deductibleType: string | null = null;
  private _amount: number | null = null;
  private _subjectToMinPercent: number | null = null;
  private _subjectToMinAmount: number | null = null;
  private _deductibleCode: string | null = null;
  private _comment: string | null = null;
  private _isExcluded = false;
  private _isSubjectToMin: boolean | null = null;
  private _isDirty = false;
  invalidList: string[] = [];
  isDuplicate = false;

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
      this.isSubjectToMin = null;
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
  get isValid(): boolean {
    const valid = true;
    //valid = this.validate(valid);
    return valid;
  }

  constructor(deductible?: PropertyQuoteDeductible) {
    if (deductible) {
      this.existingInit(deductible);
    } else {
      this.newInit();
    }
  }

  existingInit(deductible: PropertyQuoteDeductible) {

    this._propertyDeductibleId = deductible.propertyQuoteDeductibleId;
    this._deductibleType = deductible.deductibleType;
    this._amount = deductible.amount;
    this._subjectToMinPercent = deductible.subjectToMinPercent;
    this._subjectToMinAmount = deductible.subjectToMinAmount;
    this._deductibleCode = deductible.deductibleCode;
    this._comment = deductible.comment;
    this._isExcluded = deductible.isExcluded;
    this._isSubjectToMin = deductible.isSubjectToMin;
    this.setReadonlyFields();
    this.setRequiredFields();
  }

  newInit() {


  }

  markClean() {
    this._isDirty = false;
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

  get deductibleReadonly(): boolean {
    return this._propertyDeductibleId == 1 || this._propertyDeductibleId == 2 || this._isExcluded;
  }
  get amountReadonly(): boolean {
    return this._isSubjectToMin || this._isExcluded;
  }
  get isExcludedVisible(): boolean {
    return this._propertyDeductibleId != 1;
  }
  get isSubjectToMinVisible(): boolean {
    return this._propertyDeductibleId != 1 && !this._isExcluded;
  }
  get subjectToMinVisible(): boolean {
    return this._propertyDeductibleId != 1 && (this._isSubjectToMin ?? false);
  }
  get deductibleRequired(): boolean {
    return !this.deductibleReadonly;
  }
  get amountRequired(): boolean {
    return !this._isSubjectToMin && !this._isExcluded;
  }
  get deductibleTypeRequired(): boolean {
    return !this._isExcluded;
  }
  get deductibleCodeRequired(): boolean {
    return !this._isExcluded;
  }
  get subjectToMinPercentRequired(): boolean {
    return this._isSubjectToMin ?? false;
  }
  get subjectToMinAmountRequired(): boolean {
    return this._isSubjectToMin ?? false;
  }
}

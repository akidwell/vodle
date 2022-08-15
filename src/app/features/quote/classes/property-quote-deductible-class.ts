import { PropertyDeductible } from '../models/property-deductible';
import { QuoteValidation } from '../models/quote-validation';


export class PropertyQuoteDeductibleClass implements PropertyDeductible, QuoteValidation {
  private _isDirty = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  propertyQuoteDeductibleId: number | null = null;
  propertyQuoteId: number | null = null;
  sequence: number | null = null;
  isDeductibleLocked = false;
  isDeductibleTypeLocked = false;
  isExcludeLocked = false;
  isSubjectToMinLocked = false;

  private _propertyDeductibleId: number | null = null;
  private _isAppliedToAll: boolean | null = null;
  private _premisesNumber: number | null = null;
  private _buildingNumber: number | null = null;
  private _deductibleType: string | null = null;
  private _amount: number | null = null;
  private _subjectToMinPercent: number | null = null;
  private _subjectToMinAmount: number | null = null;
  private _deductibleCode: string | null = null;
  private _comment: string | null = null;
  private _isExcluded = false;
  private _isSubjectToMin: boolean | null = null;
  isNew = false;
  invalidList: string[] = [];

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
  get isAppliedToAll() : boolean | null {
    return this._isAppliedToAll;
  }
  set isAppliedToAll(value: boolean | null) {
    this._isAppliedToAll = value;
    this._isDirty = true;
  }
  get premisesNumber() : number | null {
    return this._premisesNumber;
  }
  set premisesNumber(value: number | null) {
    this._premisesNumber = value;
    this._isDirty = true;
  }
  get buildingNumber() : number | null {
    return this._buildingNumber;
  }
  set buildingNumber(value: number | null) {
    this._buildingNumber = value;
    this._isDirty = true;
  }
  get building() : string | null {
    if (this._isAppliedToAll) {
      return 'All';
    }
    else if (this._premisesNumber == null || this._buildingNumber == null) {
      return null;
    }
    return this._premisesNumber.toString() + '-' + this._buildingNumber.toString();
  }
  set building(value: string | null) {
    if (value == 'All') {
      this._isAppliedToAll = true;
      this._premisesNumber = null;
      this._buildingNumber = null;
      this._isDirty = true;
    }
    else {
      const parse = value?.split('-');
      if (parse?.length == 2) {
        const premises = parse[0] ?? '';
        const building = parse[1] ?? '';
        this._isAppliedToAll = false;
        this._premisesNumber = isNaN(Number(premises)) ? null : Number(premises) ;
        this._buildingNumber = isNaN(Number(building)) ? null : Number(building) ;
        this._isDirty = true;
      }
      else {
        this._isAppliedToAll = false;
        this._premisesNumber = null;
        this._buildingNumber = null;
        this._isDirty = true;
      }
    }
  }

  get isDirty() : boolean {
    return this._isDirty;
  }
  get canBeSaved(): boolean {
    return this._canBeSaved;
  }
  get errorMessages(): string[] {
    return this._errorMessages;
  }
  get isValid(): boolean {
    const valid = true;
    //valid = this.validate(valid);
    return valid;
  }

  constructor(deductible?: PropertyDeductible) {
    if (deductible) {
      this.existingInit(deductible);
    } else {
      this.newInit();
    }
  }

  existingInit(deductible: PropertyDeductible) {
    this.propertyQuoteDeductibleId = deductible.propertyQuoteDeductibleId;
    this.propertyQuoteId = deductible.propertyQuoteId;
    this.sequence = deductible.sequence;
    this._isAppliedToAll = deductible.isAppliedToAll;
    this._premisesNumber = deductible.premisesNumber;
    this._buildingNumber = deductible.buildingNumber;
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
    this.setReadonlyFields();
    this.setRequiredFields();
  }

  newInit() {
    this.propertyQuoteDeductibleId = 0;
    this.propertyQuoteId = 0;
    this.isExcluded = false;
    this.isSubjectToMin = false;
    this.isNew = true;
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

  validation(valid: boolean): boolean {
    this.invalidList = [];
    if (!this.validateAmount()) {
      valid = false;
    }
    return valid;
  }

  validateAmount(): boolean {
    let valid = true;
    if (!this.isExcluded && (this.amount ?? 0) > 0) {
      valid = false;
      this.invalidList.push('Amount is required');
    }
    return valid;
  }

  validateDeductibleType(): boolean {
    let valid = true;
    if (!this.isExcluded && !this.deductibleType) {
      valid = false;
      this.invalidList.push('Deductible Type is required');
    }
    return valid;
  }

  validateDeductibleCode(): boolean {
    let valid = true;
    if (!this.isExcluded && !this.deductibleCode) {
      valid = false;
      this.invalidList.push('Deductible Code is required');
    }
    return valid;
  }

  get deductibleReadonly(): boolean {
    return this.isDeductibleLocked || this._isExcluded;
  }
  get deductibleTypeReadonly(): boolean {
    return this.isDeductibleTypeLocked || this._isExcluded;
  }
  get amountReadonly(): boolean {
    return this._isSubjectToMin || this._isExcluded;
  }
  get isExcludedReadonly(): boolean {
    return this._propertyDeductibleId === null;
  }
  get isExcludedVisible(): boolean {
    return !this.isExcludeLocked;
  }
  get isSubjectToMinVisible(): boolean {
    return !this.isSubjectToMinLocked && !this._isExcluded;
  }
  get subjectToMinVisible(): boolean {
    return this._isSubjectToMin ?? false;
  }
  get deleteVisible(): boolean {
    return !this.isDeductibleLocked;
  }
  get deductibleRequired(): boolean {
    return !this.deductibleReadonly;
  }
  get amountRequired(): boolean {
    return !this._isSubjectToMin && !this._isExcluded;
  }
  get deductibleTypeRequired(): boolean {
    return !this.deductibleTypeReadonly && !this._isExcluded;
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
      isNew: this.isNew
    };
  }
}

import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationClass } from 'src/app/features/quote/classes/quote-validation-class';
import { QuoteAfterSave } from 'src/app/features/quote/models/quote-after-save';
import { OptionalPremium } from '../interfaces/optional-premium';
import { Validation } from '../interfaces/validation';
import { OptionalPremiumMapping } from '../models/optional-premium-mapping';
import { ChildBaseClass, ErrorMessageSettings } from 'src/app/features/policy-v2/classes/base/child-base-class';

export abstract class OptionalPremiumClass extends ChildBaseClass implements OptionalPremium, Validation, QuoteAfterSave{
  _isDirty = false;
  _isValid = false;
  _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  private _coverageCode: number | null = null;
  private _limit: number | null = null;
  private _subjectToMaxPercent: number | null = null;
  private _isSubjectToMaxAmount = false;
  private _isDeductibleSelected = false;
  private _deductible: number | null = null;
  private _deductibleType: string | null = null;
  private _deductibleCode: string | null = null;
  private _additionalPremium: number | null = null;
  private _additionalDetail = '';
  private _buildingNumber: number | null = null;
  private _premisesNumber: number | null = null;
  private _isAppliedToAll = false;

  get buildingNumber() : number | null {
    return this._buildingNumber;
  }
  set buildingNumber(value: number | null) {
    this._buildingNumber = value;
  }

  get premisesNumber() : number | null {
    return this._premisesNumber;
  }
  set premisesNumber(value: number | null) {
    this._premisesNumber= value;
  }

  get isAppliedToAll() : boolean {
    return this._isAppliedToAll;
  }
  set isAppliedToAll(value: boolean) {
    this._isAppliedToAll= value;
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
    } else {
      const parse = value?.split('-');
      console.log('line70', value, parse);
      if (parse?.length == 2) {
        const premises = parse[0] ?? '';
        const building = parse[1] ?? '';
        this._isAppliedToAll = false;
        this._premisesNumber = isNaN(Number(premises)) ? null : Number(premises) ;
        this._buildingNumber = isNaN(Number(building)) ? null : Number(building) ;
      }
      else {
        this._isAppliedToAll = false;
        this._premisesNumber = null;
        this._buildingNumber = null;
      }
    }
  }

  premiumMapping: OptionalPremiumMapping | null = null;
  isNew = false;
  guid = '';
  invalidList: string[] = [];
  isCopy = false;
  focus = false;
  settings: ErrorMessageSettings = {preventSave: true, tabAffinity: ValidationTypeEnum.Premium, failValidation: true};

  isZipLookup = false;

  constructor(optionalPremium?: OptionalPremium){
    super();
    if (optionalPremium) {
      this.existingInit(optionalPremium);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(ValidationTypeEnum.Child, QuoteValidationTabNameEnum.PropertyMortgageeAdditionalInterest);
    this.validate();
  }

  private _markForDeletion = false;
  get markForDeletion() : boolean {
    return this._markForDeletion;
  }
  set markForDeletion(value: boolean) {
    this._markForDeletion = value;
    this.markDirty();
  }
  get coverageCode(): number | null {
    return this._coverageCode;
  }
  set coverageCode(value: number | null) {
    this.markDirty();
    this._coverageCode = value;
  }
  get limit(): number | null{
    return this._limit;
  }
  set limit(value: number | null) {
    this.markDirty();
    this._limit = value;
  }
  get subjectToMaxPercent(): number | null {
    return this._subjectToMaxPercent;
  }
  set subjectToMaxPercent(value: number | null) {
    this.markDirty();
    this._subjectToMaxPercent = value;
  }
  get isSubjectToMaxAmount(): boolean {
    return this._isSubjectToMaxAmount;
  }
  set isSubjectToMaxAmount(value: boolean) {
    this.markDirty();
    this._isSubjectToMaxAmount = value;
  }
  get isDeductibleSelected(): boolean {
    return this._isDeductibleSelected;
  }
  set isDeductibleSelected(value: boolean) {
    this.markDirty();
    this._isDeductibleSelected = value;
  }
  get deductible(): number | null {
    return this._deductible;
  }
  set deductible(value: number | null) {
    this.markDirty();
    this._deductible = value;
  }
  get deductibleType(): string | null {
    return this._deductibleType;
  }
  set deductibleType(value: string | null) {
    this.markDirty();
    this._deductibleType = value;
  }
  get deductibleCode(): string | null {
    return this._deductibleCode;
  }
  set deductibleCode(value: string | null) {
    this.markDirty();
    this._deductibleCode = value;
  }
  get additionalPremium(): number | null {
    return this._additionalPremium;
  }
  set additionalPremium(value: number | null) {
    this.markDirty();
    this._additionalPremium = value;
  }
  get additionalDetail(): string {
    return this._additionalDetail;
  }
  set additionalDetail(value: string) {
    this.markDirty();
    this._additionalDetail = value;
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

  get errorMessages(): string[] {
    return this._errorMessages;
  }
  set errorMessages(value: string[]){
    this._errorMessages = value;
  }

  validate(){
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks
      this.classValidation();
      this._validateOnLoad = false;
    }
    this._validationResults.resetValidation();
    this._validationResults.mapValues(this);
    return this._validationResults;
  }

  abstract classValidation(): void;

  existingInit(optionalPremium: OptionalPremium){
    this.buildingNumber = optionalPremium.buildingNumber;
    this.premisesNumber = optionalPremium.premisesNumber;
    this.isAppliedToAll = optionalPremium.isAppliedToAll;
    this.guid = optionalPremium.guid ?? crypto.randomUUID();
    this._coverageCode = optionalPremium.coverageCode;
    this._limit = optionalPremium.limit;
    this._isSubjectToMaxAmount = optionalPremium.isSubjectToMaxAmount;
    this._subjectToMaxPercent = optionalPremium.subjectToMaxPercent;
    this._isDeductibleSelected = optionalPremium.isDeductibleSelected;
    this._deductible = optionalPremium.deductible;
    this._deductibleType = optionalPremium.deductibleType;
    this._deductibleCode = optionalPremium.deductibleCode;
    this._additionalPremium = optionalPremium.additionalPremium;
    this._additionalDetail = optionalPremium.additionalDetail;
  }

  newInit() {
    this.isNew = true;
    this.isAppliedToAll = true;
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
  isPremiumMappingSet() {
    return this.premiumMapping ? true : false;
  }
  isSubjectToMaxAmountAvailable() {
    return this.premiumMapping && this.premiumMapping.subjectToMaxAmountAvailable;
  }
  isSubjectToMaxAmountRequired() {
    return this.premiumMapping && this.premiumMapping.subjectToMaxAmountAvailable ? this.premiumMapping.subjectToMaxAmountRequired : false;
  }
  isLimitAvailable() {
    return this.premiumMapping && this.premiumMapping.limitAvailable;
  }
  isLimitRequired() {
    return this.premiumMapping && this.premiumMapping.limitAvailable ? this.premiumMapping.limitRequired : false;
  }
  isDeductibleAvailable() {
    return this.premiumMapping && this.premiumMapping.deductibleAvailable;
  }
  isDeductibleRequired() {
    return this.premiumMapping && this.premiumMapping.deductibleRequired;
  }
  isAdditionalDetailRequired() {
    return this.premiumMapping && this.premiumMapping.additionalDetailRequired;
  }
  isAdditionalPremiumRequired() {
    return this.premiumMapping && this.premiumMapping.additionalPremiumRequired;
  }
  validateLimit() {
    let invalid = false;
    if (this.isLimitRequired() && (this.limit ?? 0) == 0) {
      invalid = true;
      this.invalidList.push('Limit is required');
      this.createErrorMessage('Limit is required', this.settings);
    }
    this._isValid = this._isValid == true ? invalid : false;
  }
  validateAdditionalDetail() {
    let invalid = false;
    if (this.isAdditionalDetailRequired() && !this._additionalDetail) {
      invalid = true;
      this.invalidList.push('Additional Detail is required');
      this.createErrorMessage('Additional Detail is required', this.settings);
    }
    this._isValid = this._isValid == true ? invalid : false;
  }
  validateAdditionalPremium() {
    let invalid = false;
    if (this.isAdditionalPremiumRequired() && !this._additionalPremium) {
      invalid = true;
      this.invalidList.push('Additional Premium is required');
      this.createErrorMessage('Additional Premium is required', this.settings);
    }
    this._isValid = this._isValid == true ? invalid : false;
  }
  validateDeductible() {
    let invalid = false;
    if (this._isDeductibleSelected && !this.deductible) {
      invalid = true;
      this.invalidList.push('Deductible is required');
      this.createErrorMessage('Deductible is required', this.settings);
    }
    this._isValid = this._isValid == true ? invalid : false;
  }
  validateDeductibleType() {
    let invalid = false;
    if (this._isDeductibleSelected && !this._deductibleType) {
      invalid = true;
      //this._canBeSaved = false;
      this.invalidList.push('Deductible Type is required');
      this.createErrorMessage('Deductible Type is required', this.settings);
    }
    this._isValid = this._isValid == true ? invalid : false;
  }

  validateDeductibleCode() {
    let invalid = false;
    if (this._isDeductibleSelected && !this._deductibleCode) {
      invalid = true;
      //this._canBeSaved = false;
      this.invalidList.push('Deductible Code is required');
      this.createErrorMessage('Deductible Code is required', this.settings);
    }
    this._isValid = this._isValid == true ? invalid : false;
  }
  validateSubjectToMaxAmount() {
    let invalid = false;
    if (this.isSubjectToMaxAmount && (this._subjectToMaxPercent ?? 0) == 0) {
      invalid = true;
      //this._canBeSaved = false;
      this.invalidList.push('Subject to Max Amount is required');
      this.createErrorMessage('Subject to Max Amount is required', this.settings);
    }
    this._isValid = this._isValid == true ? invalid : false;
  }

  validateBuilding() {
    if (!this.isAppliedToAll && (this.emptyNumberValueCheck(this.premisesNumber) || this.emptyNumberValueCheck(this.buildingNumber))) {
      this._canBeSaved = false;
      this._isValid = false;
      this.invalidList.push('Premises/Building Number is required');
      this.createErrorMessage('Premises/Building Number is required', this.settings);
    }
  }
  emptyNumberValueCheck(value: number | null | undefined) {
    return !value;
  }
  emptyStringValueCheck(value: string | null | undefined) {
    return !value;
  }
  onChangeSubjectToMax() {
    this._subjectToMaxPercent = null;
  }
  onChangeDeductible() {
    this._deductible = null;
    this._deductibleCode = null;
    this._deductibleType = null;
  }
  setErrorMessages() {
    this._errorMessages = this.invalidList;
  }
  abstract copy(): OptionalPremium;
  abstract toJSON(): OptionalPremium;
}


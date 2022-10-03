import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationClass } from 'src/app/features/quote/classes/quote-validation-class';
import { QuoteAfterSave } from 'src/app/features/quote/models/quote-after-save';
import { OptionalPremium } from '../interfaces/optional-premium';
import { Validation } from '../interfaces/validation';
import { BuildingLocationClass } from './building-location-class';
import { OptionalPremiumMapping } from '../models/optional-premium-mapping';

export abstract class OptionalPremiumClass extends BuildingLocationClass implements OptionalPremium, Validation, QuoteAfterSave{
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  private _coverageCode: number | null = null;
  private _limit: number | null = null;
  private _subjectToMaxAmount = false;
  private _subjectToMaxPercent: number | null = null;
  private _hasDeductible = false;
  private _deductible: number | null = null;
  private _deductibleType: number | null = null;
  private _deductibleCode: number | null = null;
  private _additionalPremium: number | null = null;
  private _additionalComment = '';

  premiumMapping: OptionalPremiumMapping | null = null;
  isNew = false;
  guid = '';
  invalidList: string[] = [];
  isCopy = false;
  isZipLookup = false;

  constructor(optionalPremium?: OptionalPremium){
    super();
    if (optionalPremium) {
      this.existingInit(optionalPremium);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.PropertyMortgageeAdditionalInterest);
    this.validate();
  }
  get coverageCode(): number | null {
    return this._coverageCode;
  }
  set coverageCode(value: number | null) {
    this._isDirty = true;
    this._coverageCode = value;
  }
  get limit(): number | null{
    return this._limit;
  }
  set limit(value: number | null) {
    this._isDirty = true;
    this._limit = value;
  }
  get subjectToMaxAmount(): boolean {
    return this._subjectToMaxAmount;
  }
  set subjectToMaxAmount(value: boolean) {
    this._isDirty = true;
    this._subjectToMaxAmount = value;
  }
  get subjectToMaxPercent(): number | null {
    return this._subjectToMaxPercent;
  }
  set subjectToMaxPercent(value: number | null) {
    this._isDirty = true;
    this._subjectToMaxPercent = value;
  }
  get hasDeductible(): boolean {
    return this._hasDeductible;
  }
  set hasDeductible(value: boolean) {
    this._isDirty = true;
    this._hasDeductible = value;
  }
  get deductible(): number | null {
    return this._deductible;
  }
  set deductible(value: number | null) {
    this._isDirty = true;
    this._deductible = value;
  }
  get deductibleType(): number | null {
    return this._deductibleType;
  }
  set deductibleType(value: number | null) {
    this._isDirty = true;
    this._deductibleType = value;
  }
  get deductibleCode(): number | null {
    return this._deductibleCode;
  }
  set deductibleCode(value: number | null) {
    this._isDirty = true;
    this._deductibleCode = value;
  }
  get additionalPremium(): number | null {
    return this._additionalPremium;
  }
  set additionalPremium(value: number | null) {
    this._isDirty = true;
    this._additionalPremium = value;
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

  validate(){
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks
      this.classValidation();
      this._validateOnLoad = false;
      console.log(this._canBeSaved);
    }
    this._validationResults.resetValidation();
    this._validationResults.mapValues(this);
    return this._validationResults;
  }

  abstract classValidation(): void;

  existingInit(optionalPremium: OptionalPremium){
    this.buildingNumber = optionalPremium.buildingNumber;
    this.premisesNumber = optionalPremium.premisesNumber;
    this._coverageCode = optionalPremium.coverageCode;
    this._limit = optionalPremium.limit;
    this._subjectToMaxAmount = optionalPremium.subjectToMaxAmount;
    this._subjectToMaxPercent = optionalPremium.subjectToMaxPercent;
    this._hasDeductible = optionalPremium.hasDeductible;
    this._deductible = optionalPremium.deductible;
    this._deductibleType = optionalPremium.deductibleType;
    this._deductibleCode = optionalPremium.deductibleCode;
    this._additionalPremium = optionalPremium.additionalPremium;
  }

  newInit() {
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
  isDeductibleRequired() {
    return this.premiumMapping && this.premiumMapping.deductibleRequired;
  }
  isAdditionalDetailRequired() {
    return this.premiumMapping && this.premiumMapping.additionalDetailRequired;
  }
  isAdditionalPremiumRequired() {
    return false;
  }
  abstract copy(): OptionalPremium;
  abstract toJSON(): OptionalPremium;
}


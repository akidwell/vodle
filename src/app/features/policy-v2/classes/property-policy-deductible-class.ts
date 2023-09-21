import { Validation } from 'src/app/shared/interfaces/validation';
import { PropertyDeductible } from '../../quote/models/property-deductible';
import { PolicyValidationClass } from './policy-validation-class';
import { ChildBaseClass } from './base/child-base-class';
import { PolicyValidationTabNameEnum } from 'src/app/core/enums/policy-validation-tab-name-enum';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { PropertyPolicyDeductible } from '../models/property-policy-deductible';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { ValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';

export class PropertyPolicyDeductibleClass extends ChildBaseClass implements PropertyPolicyDeductible, Validation {
    
    private _isValid = true;
    private _errorMessages: string[] = [];
    private _validateOnLoad = true;
    private _validationResults: PolicyValidationClass;
    private _isDuplicate = false;
    private _propertyDeductibleId: number | null = null;
    private _deductibleType: string | null = null;
    private _amount: number | null = null;
    private _subjectToMinPercent: number | null = null;
    private _subjectToMinAmount: number | null = null;
    private _deductibleCode: string | null = null;
    private _comment: string | null = null;
    private _isExcluded = false;
    private _isSubjectToMin: boolean | null = null;
    private _buildingNumber: number | null = null;
    private _premisesNumber: number | null = null;
    private _isAppliedToAll = false;
    private _markForDeletion: boolean | null = null;

    endorsementDeductibleId: number | null = null;
    policyId: number | null = null;
    endorsementNo: number | null = null;
    sequence: number | null = null;
    isDeductibleLocked = false;
    isDeductibleTypeLocked = false;
    isExcludeLocked = false;
    isSubjectToMinLocked = false;
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
  
    
    get errorMessages(): string[] {
      return this._errorMessages;
    }
    set errorMessages(value: string[]){
      this._errorMessages = value;
    }
  
    get validationResults(): PolicyValidationClass {
      return this._validationResults;
    }
    get isDuplicate(): boolean {
      return this._isDuplicate;
    }
    set isDuplicate(value: boolean ) {
      this._isDuplicate = value;
      this._isDirty = true;
    }
  
  get deductibleReadonly(): boolean {
    return this.isDeductibleLocked || this._isExcluded;
  }
  get deductibleTypeReadonly(): boolean {
    return this.isDeductibleTypeLocked || this._isExcluded;
  }
  get amountReadonly(): boolean {
    return this.isSubjectToMin || this._isExcluded;
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

    constructor(deductible?: PropertyPolicyDeductible) {
      super();
      if (deductible) {
        this.existingInit(deductible);
      } else {
        this.newInit();
      }
      this._validationResults = new PolicyValidationClass(ValidationTypeEnum.Premium, PolicyValidationTabNameEnum.CoveragePremium);
      this.validate();
    }

    static fromPropertyDeductible(deductible: PropertyDeductible): PropertyPolicyDeductibleClass {
      const policyDeductible = new PropertyPolicyDeductibleClass();
      policyDeductible.isAppliedToAll = deductible.isAppliedToAll;
      policyDeductible.premisesNumber = deductible.premisesNumber;
      policyDeductible.buildingNumber = deductible.buildingNumber;
      policyDeductible.sequence = deductible.sequence;
      policyDeductible.deductibleType = deductible.deductibleType;
      policyDeductible.deductibleCode = deductible.deductibleCode;
      policyDeductible.comment = deductible.comment;
      policyDeductible.amount = deductible.amount;
      policyDeductible.subjectToMinPercent = deductible.subjectToMinPercent;
      policyDeductible.subjectToMinAmount = deductible.subjectToMinAmount;
      policyDeductible.isExcluded = deductible.isExcluded;
      policyDeductible.isSubjectToMin = deductible.isSubjectToMin;
      policyDeductible.isNew = deductible.isNew;
      policyDeductible.isDeductibleLocked = deductible.isDeductibleLocked;
      policyDeductible.isDeductibleTypeLocked = deductible.isDeductibleTypeLocked;
      policyDeductible.isExcludeLocked = deductible.isExcludeLocked;
      policyDeductible.isSubjectToMinLocked = deductible.isSubjectToMinLocked;
      policyDeductible.markDirty();
      return policyDeductible;
    }
  
    validateObject(): ErrorMessage[]{
        console.log('validate  deductible');
        //on load or if dirty validate this
        console.log('BBBBBBBBBBB' + this);
        console.log('AAAAAAAAAAA ' + this.isDirty);
        if (this.isDirty){
          //TODO: class based validation checks
          this.errorMessagesList = [];
          this.canBeSaved = true;
          this.isValid = true;
        //   console.log(this.pacCode);
        //   if(this.pacCode == ''){
        //     this.createErrorMessage('PacCode is required.');
        //   }
        }
        return this.errorMessagesList;
      }
    
      onGuidNewMatch(T: ChildBaseClass): void {
      }
      onGuidUpdateMatch(T: ChildBaseClass): void {
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
  
    existingInit(deductible: PropertyPolicyDeductible) {
      this.endorsementDeductibleId = deductible.endorsementDeductibleId;
      this.policyId = deductible.policyId;
      this.endorsementNo = deductible.endorsementNo;
      this.sequence = deductible.sequence;
      this.isAppliedToAll = deductible.isAppliedToAll;
      this.premisesNumber = deductible.premisesNumber;
      this.buildingNumber = deductible.buildingNumber;
      this._propertyDeductibleId = deductible.endorsementDeductibleId;
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
      this.endorsementDeductibleId = 0;
      this.policyId = 0;
      this.endorsementNo = 0;
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
        endorsementDeductibleId: this.endorsementDeductibleId,
        policyId: this.policyId,
        endorsementNo: this.endorsementNo,
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
        building: this.building,
        markForDeletion: this.markForDeletion,
        validate: () => null
      };
    }
  }
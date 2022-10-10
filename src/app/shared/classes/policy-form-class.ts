import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { QuoteValidationTypeEnum } from 'src/app/core/enums/validation-type-enum';
import { QuoteValidationClass } from 'src/app/features/quote/classes/quote-validation-class';
import { QuoteAfterSave } from 'src/app/features/quote/models/quote-after-save';
import { PolicyForm } from '../interfaces/policy-form';
import { Validation } from '../interfaces/validation';
import { VariableFormData } from '../interfaces/variable-form-data';

export abstract class PolicyFormClass implements PolicyForm, Validation, QuoteAfterSave{
  private _isDirty = false;
  private _isValid = false;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;
  private _isIncluded = false;
  private _formData: VariableFormData[] | null = null;

  invalidList: string[] = [];
  formName: string | null = null;
  formTitle: string | null = null;
  isMandatory = false;
  specimenLink: string | null = null;
  hasSpecialNote = false;
  isVariable = false;
  formCategory: string | null = null;
  categorySequence: number | null = null;
  sortSequence: number | null = null;
  formIndex: number | null = null;
  allowMultiples: boolean | null = null;
  canAdd = true;

  get isIncluded(): boolean {
    return this._isIncluded;
  }
  set isIncluded(value: boolean) {
    this._isDirty = true;
    this._isIncluded = value;
  }
  get formData(): VariableFormData[] | null {
    return this._formData;
  }
  set formData(value: VariableFormData[] | null) {
    this._isDirty = true;
    this._formData = value;
  }
  constructor(policyForm?: PolicyForm){
    if (policyForm) {
      this.existingInit(policyForm);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.FormsList);
    this.validate();
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

  existingInit(policyForm: PolicyForm){
    this.formName = policyForm.formName;
    this.formTitle = policyForm.formTitle;
    this.isMandatory = policyForm.isMandatory;
    this.specimenLink = policyForm.specimenLink;
    this.hasSpecialNote = policyForm.hasSpecialNote;
    this.isVariable = policyForm.isVariable;
    this.formCategory = policyForm.formCategory;
    this.categorySequence = policyForm.categorySequence;
    this.sortSequence = policyForm.sortSequence;
    this.formIndex = policyForm.formIndex;
    this.allowMultiples = policyForm.allowMultiples;
    this._isIncluded = policyForm.isIncluded;
    this._formData = policyForm.formData;
  }

  newInit() {
    //this.isNew = true;
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

  markClean() {
    this._isDirty = false;
  }
  markStructureClean(): void {
    this.markClean();
  }
  markDirty() {
    this._isDirty = true;
  }
  abstract toJSON(): PolicyForm;
}
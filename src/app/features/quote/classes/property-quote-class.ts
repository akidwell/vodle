import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { PropertyQuote } from '../models/property-quote';
import { QuoteValidation } from '../models/quote-validation';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';
import { PropertyQuoteDeductibleClass } from './property-quote-deductible-class';
import { QuoteValidationClass } from './quote-validation-class';

export class PropertyQuoteClass implements PropertyQuote, QuoteValidation {
  quoteId = null;
  propertyQuoteDeductible: PropertyQuoteDeductibleClass[] = [];
  propertyQuoteBuilding: PropertyQuoteBuildingClass[] = [];

  private _riskDescription: string | null = null;
  private _isDirty = false;
  private _isValid = true;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  get riskDescription() : string | null {
    return this._riskDescription;
  }
  set riskDescription(value: string | null) {
    this._riskDescription = value;
    this._isDirty = true;
  }

  constructor(propertyQuote?: PropertyQuote) {
    if (propertyQuote) {
      this.existingInit(propertyQuote);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Child, QuoteValidationTabNameEnum.PropertyLocationCoverages);
    // this.propertyQuoteDeductible.push(new PropertyQuoteDeductibleClass());
    // this.propertyQuoteDeductible.push(new PropertyQuoteDeductibleClass());
    this.validate();
  }
  get isDirty(): boolean {
    return this._isDirty ;
  }
  get isValid(): boolean {
    // let valid = true;
    // valid = this.validate(valid);
    return this._isValid;
  }
  get canBeSaved(): boolean {
    return this._canBeSaved;
  }
  get errorMessages(): string[] {
    return this._errorMessages;
  }
  get validationResults(): QuoteValidationClass {
    return this._validationResults;
  }
  existingInit(propertyQuote: PropertyQuote) {
    this.riskDescription = propertyQuote.riskDescription;

    const deductibles: PropertyQuoteDeductibleClass[] = [];
    propertyQuote.propertyQuoteDeductible.forEach(element => {
      deductibles.push(new PropertyQuoteDeductibleClass(element));
    });
    this.propertyQuoteDeductible = deductibles;

    const buildings: PropertyQuoteBuildingClass[] = [];
    propertyQuote.propertyQuoteBuilding.forEach(element => {
      buildings.push(new PropertyQuoteBuildingClass(element));
    });
    this.propertyQuoteBuilding = buildings;

    this.setReadonlyFields();
    this.setRequiredFields();
  }
  validate(){
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks
      this._isValid = true;
      this._canBeSaved = true;
      this._errorMessages = ['Property Quote'];
      this._validateOnLoad = false;
    }
    this._validationResults.mapValues(this);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteDeductible);
    return this._validationResults;
  }
  newInit() {
    this.setReadonlyFields();
    this.setRequiredFields();
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
}

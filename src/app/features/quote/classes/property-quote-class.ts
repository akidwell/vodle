import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { MortgageeClass } from 'src/app/shared/components/propertry-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { PropertyQuote } from '../models/property-quote';
import { QuoteValidation } from '../models/quote-validation';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';
import { PropertyQuoteDeductibleClass } from './property-quote-deductible-class';
import { QuoteValidationClass } from './quote-validation-class';

export class PropertyQuoteClass implements PropertyQuote, QuoteValidation {
  quoteId = null;
  propertyQuoteDeductible: PropertyQuoteDeductibleClass[] = [];
  propertyQuoteBuilding: PropertyQuoteBuildingClass[] = [];
  propertyQuoteMortgagee: MortgageeClass[] = [];
  propertyQuoteAdditionalInterest: AdditionalInterestClass[] = [];

  private _riskDescription: string | null = null;
  private _isDirty = false;
  private _isValid = true;
  private _canBeSaved = true;
  private _errorMessages: string[] = [];
  private _validateOnLoad = true;
  private _validationResults: QuoteValidationClass;

  get riskDesciption() : string | null {
    return this._riskDescription;
  }
  set riskDesciption(value: string | null) {
    this._riskDescription = value;
    this._isDirty = true;
  }
  get limitTotal(): number {
    let total = 0;
    this.propertyQuoteBuilding.forEach((c) =>
      c.propertyQuoteBuildingCoverage.forEach((coverage) => (total += coverage.limit ?? 0))
    );
    return total;
  }
  get coverageCount(): number {
    let total = 0;
    this.propertyQuoteBuilding.forEach((c) => total += c.propertyQuoteBuildingCoverage.length ?? 0
    );
    return total;
  }

  constructor(propertyQuote?: PropertyQuote) {
    console.log('happens');
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
    this.riskDesciption = propertyQuote.riskDesciption;

    const deductibles: PropertyQuoteDeductibleClass[] = [];
    propertyQuote.propertyQuoteDeductible.forEach((element) => {
      deductibles.push(new PropertyQuoteDeductibleClass(element));
    });
    this.propertyQuoteDeductible = deductibles;

    const mortgagee: MortgageeClass[] = [];
    propertyQuote.propertyQuoteMortgagee.forEach((element) => {
      mortgagee.push(new MortgageeClass(element));
    });
    this.propertyQuoteMortgagee = mortgagee;

    const ai: AdditionalInterestClass[] = [];
    propertyQuote.propertyQuoteAdditionalInterest.forEach((element) => {
      ai.push(new AdditionalInterestClass(element));
    });
    this.propertyQuoteMortgagee = mortgagee;
    this.propertyQuoteAdditionalInterest = ai;

    const buildings: PropertyQuoteBuildingClass[] = [];
    propertyQuote.propertyQuoteBuilding.forEach((element) => {
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

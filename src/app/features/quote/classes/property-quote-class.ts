import { QuoteValidationTypeEnum } from 'src/app/core/enums/quote-validation-enum';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { Code } from 'src/app/core/models/code';
import { MortgageeClass } from 'src/app/shared/components/propertry-mortgagee/mortgagee-class';
import { AdditionalInterestClass } from 'src/app/shared/components/property-additional-interest.ts/additional-interest-class';
import { AdditionalInterestData } from '../models/additional-interest';
import { MortgageeData } from '../models/mortgagee';
import { PropertyBuildingCoverage, PropertyBuildingCoverageSubjectAmountData } from '../models/property-building-coverage';
import { PropertyDeductibleData } from '../models/property-deductible';
import { PropertyQuote } from '../models/property-quote';
import { QuoteValidation } from '../models/quote-validation';
import { PropertyQuoteBuildingClass } from './property-quote-building-class';
import { PropertyQuoteBuildingCoverageClass } from './property-quote-building-coverage-class';
import { PropertyQuoteDeductibleClass } from './property-quote-deductible-class';
import { QuoteValidationClass } from './quote-validation-class';

export class PropertyQuoteClass implements PropertyQuote, QuoteValidation {
  propertyQuoteId: number | null = null;
  quoteId: number | null = null;

  propertyQuoteDeductible: PropertyQuoteDeductibleClass[] = [];
  coveragesTabValidation: QuoteValidationClass | null = null;

  termsAndConditionsTabValidation: QuoteValidationClass | null = null;

  propertyQuoteBuilding: PropertyQuoteBuildingClass[] = [];
  propertyQuoteBuildingLocationTabValidation: QuoteValidationClass | null = null;

  propertyQuoteMortgagee: MortgageeClass[] = [];
  propertyQuoteAdditionalInterest: AdditionalInterestClass[] = [];
  propertyQuoteMortgageeAdditionalInterestTabValidation: QuoteValidationClass | null = null;



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
  get limitTotal(): number {
    let total = 0;
    this.propertyQuoteBuilding.forEach((c) =>
      c.propertyQuoteBuildingCoverage.forEach((coverage) => (total += coverage.limit ?? 0))
    );
    return total;
  }

  get largestTiv(): number {
    let largest = 0;
    this.propertyQuoteBuilding.forEach(x => {
      if (x.propertyQuoteBuildingCoverage.length == 0){
        return 0;
      } else {
        const coverages: PropertyBuildingCoverage[] = [];
        this.propertyQuoteBuilding.forEach(element => {
          element.propertyQuoteBuildingCoverage.forEach(x => {
            coverages.push(new PropertyQuoteBuildingCoverageClass(x));
          });
        });
        console.log(coverages);
        largest = Math.max(...coverages.map( c => c.limit? c.limit : 0));
        return largest;
      }
    });
    return largest;
  }


  get subjectAmount(): Map<any,any> {
    const subjectAmounts: PropertyBuildingCoverageSubjectAmountData[] = [];

    this.propertyQuoteBuilding.forEach((element) => {
      element.propertyQuoteBuildingCoverage.forEach((x) => {
        const subAm: PropertyBuildingCoverageSubjectAmountData = {} as PropertyBuildingCoverageSubjectAmountData;
        subAm.subject = element.subjectNumber;
        subAm.limit = x.limit;
        subjectAmounts.push(subAm);
      });
    });
    const res = subjectAmounts.reduce((a, b) =>
      a.set(b.subject, (a.get(b.subject) || 0) + Number(b.limit)), new Map);

    return res;
  }

  get coverageCount(): number {
    let total = 0;
    this.propertyQuoteBuilding.forEach((c) => total += c.propertyQuoteBuildingCoverage.length ?? 0
    );
    return total;
  }

  get buildingList(): Code[] {
    const buildings: Code[] = [];
    const all: Code = {key: 0, code: 'All', description: 'All'};
    buildings.push(all);
    this.propertyQuoteBuilding.forEach((c) => {
      const building = (c.premisesNumber?.toString() ?? '') + '-' + (c.buildingNumber?.toString() ?? '');
      const code: Code = {key: 0, code: building, description: building + ' : ' + c.address};
      buildings.push(code);
    });
    return buildings;
  }

  constructor(propertyQuote?: PropertyQuote) {
    if (propertyQuote) {
      this.existingInit(propertyQuote);
    } else {
      this.newInit();
    }
    this._validationResults = new QuoteValidationClass(QuoteValidationTypeEnum.Quote, null);
    this.propertyQuoteBuildingLocationTabValidation = new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.PropertyLocationCoverages);
    this.propertyQuoteMortgageeAdditionalInterestTabValidation = new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.PropertyMortgageeAdditionalInterest);
    this.termsAndConditionsTabValidation = new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.TermsAndConditions);
    this.coveragesTabValidation= new QuoteValidationClass(QuoteValidationTypeEnum.Tab, QuoteValidationTabNameEnum.CoveragePremium);

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
    this.propertyQuoteId = propertyQuote.propertyQuoteId;
    this.quoteId = propertyQuote.quoteId;
    this._riskDescription = propertyQuote.riskDescription;

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
    //on load or if dirty validate this
    if (this._validateOnLoad || this.isDirty){
      //TODO: class based validation checks

      this._validateOnLoad = false;
    }
    //reset validation results
    this._validationResults.resetValidation();

    //validate children
    this.callChildValidations();

    //tab validations
    this.propertyQuoteBuildingLocationTabValidation?.validateChildrenAsStandalone(this.propertyQuoteBuilding);
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.validateChildrenAsStandalone(this.propertyQuoteMortgagee);
    this.propertyQuoteMortgageeAdditionalInterestTabValidation?.validateChildrenAndMerge(this.propertyQuoteAdditionalInterest);
    //TODO: T&C

    //map this to validation results
    this._validationResults.mapValues(this);

    //map children to validation results
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteDeductible);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteMortgagee);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteAdditionalInterest);
    this._validationResults.validateChildrenAndMerge(this.propertyQuoteBuilding);

    return this._validationResults;
  }

  callChildValidations() {
    this.childArrayValidate(this.propertyQuoteDeductible);
    this.childArrayValidate(this.propertyQuoteMortgagee);
    this.childArrayValidate(this.propertyQuoteAdditionalInterest);
    this.childArrayValidate(this.propertyQuoteBuilding);
  }
  childArrayValidate(children: QuoteValidation[]) {
    children.forEach(child => {
      child.validate ? child.validate() : null;
    });
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

  toJSON() {
    const deductibles: PropertyDeductibleData[] = [];
    this.propertyQuoteDeductible.forEach(c => deductibles.push(c.toJSON()));

    const mortgagee: MortgageeData[] = [];
    this.propertyQuoteMortgagee.forEach(c => mortgagee.push(c.toJSON()));

    const ai: AdditionalInterestData[] = [];
    this.propertyQuoteAdditionalInterest.forEach(c => ai.push(c.toJSON()));

    console.log(mortgagee);

    return {
      propertyQuoteId: this.propertyQuoteId,
      quoteId: this.quoteId,
      riskDescription: this.riskDescription,
      propertyQuoteDeductible: deductibles,
      propertyQuoteMortgagee: mortgagee,
      propertyQuoteAdditionalInterest: ai
    };
  }
}

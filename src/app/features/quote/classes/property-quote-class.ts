import { PropertyQuote } from '../models/property-quote';
import { PropertyQuoteDeductibleClass } from './property-quote-deductible-class';

export class PropertyQuoteClass implements PropertyQuote {
  quoteId = null;
  propertyQuoteDeductible: PropertyQuoteDeductibleClass[] = [];

  private _riskDescription: string | null = null;
  private _isDirty = false;

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
  }

  existingInit(propertyQuote: PropertyQuote) {
    this.riskDescription = propertyQuote.riskDescription;

    const deductibles: PropertyQuoteDeductibleClass[] = [];
    propertyQuote.propertyQuoteDeductible.forEach(element => {
      deductibles.push(new PropertyQuoteDeductibleClass(element));
    });
    this.propertyQuoteDeductible = deductibles;

    this.setReadonlyFields();
    this.setRequiredFields();
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
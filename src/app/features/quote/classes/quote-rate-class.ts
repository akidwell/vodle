import { QuoteRate } from '../models/quote-rate';

export class QuoteRateClass implements QuoteRate {
  quoteId: number | null = null;
  sequenceNo: number | null = 0;

  private _premiumRate: number | null = null;
  private _premium: number | null = null;
  private _rateBasis: number | null = null;
  private _isFlatRate: boolean | null = null;
  private _isDirty = false;

  get premiumRate() : number | null {
    return this._premiumRate;
  }
  set premiumRate(value: number | null) {
    this._premiumRate = value;
    this._isDirty = true;
  }
  get premium() : number | null {
    return this._premium;
  }
  set premium(value: number | null) {
    this._premium = value;
    this._isDirty = true;
  }
  get rateBasis() : number | null {
    return this._rateBasis;
  }
  set rateBasis(value: number | null) {
    this._rateBasis = value;
    this._isDirty = true;
  }
  get isFlatRate() : boolean | null {
    return this._isFlatRate;
  }
  set isFlatRate(value: boolean | null) {
    this._isFlatRate = value;
    this._isDirty = true;
  }

  get isDirty() : boolean {
    return this._isDirty;
  }
  get isValid(): boolean {
    let valid = true;
    //valid = this.validate(valid);
    return valid;
  }

  constructor(rate?: QuoteRateClass) {
    if (rate) {
      this.existingInit(rate);
    } else {
      this.newInit();
    }
  }

  existingInit(rate: QuoteRateClass) {
    this._premiumRate = rate.premiumRate;
    this._premium = rate.premium;
    this._rateBasis = rate.rateBasis;
    this._isFlatRate = rate.isFlatRate;

    this.setReadonlyFields();
    this.setRequiredFields();
  }

  newInit() {
    this._rateBasis = 100;
    this._isFlatRate = true;
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

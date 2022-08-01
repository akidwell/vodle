import { AdditionalInterestData } from 'src/app/features/quote/models/additional-interest';

export class AdditionalInterestClass implements AdditionalInterestData{

  private _buildingNumber: string | null = null;
  private _attention: string | null = null;
  private _description: string | null = null;
  private _locationNumber: number | null = null;
  private _interest: string | null = null;
  private _propertyQuoteId: number | null = null;
  private _propertyQuoteAdditionalInterestId: number | null = null;
  private _street1: string | null = null;
  private _street2: string | null = null;
  private _state: string | null = null;
  private _city: string | null = null;
  private _zip: string | null = null;
  private _countryCode: string | null = null;
  private _isDirty = false;
  private _isAppliedToAll = false;

  isNew = false;
  invalidList: string[] = [];
  isCopy = false;
  isZipLookup = false;

  constructor(ai?: AdditionalInterestData){
    if (ai) {
      this.existingInit(ai);
    } else {
      this.newInit();
    }
  }

  existingInit(ai?: AdditionalInterestData){
    this._buildingNumber = ai?.buildingNumber || null;
    this._attention = ai?.attention || null;
    this._description = ai?.description || null;
    this._locationNumber = ai?.premisesNumber || null;
    this._interest = ai?.interest || null;
    this._propertyQuoteId = ai?.propertyQuoteId || null;
    this._propertyQuoteAdditionalInterestId = ai?.propertyQuoteAdditionalInterestId || null;
    this._street1 = ai?.street1 || null;
    this._street2 = ai?.street2 || null;
    this._state = ai?.state || null;
    this._city = ai?.city || null;
    this._zip = ai?.zip || null;
    this._countryCode = ai?.countryCode || null;
    this._isAppliedToAll = ai?.isAppliedToAll || false;
  }

  newInit() {
    this.isNew = true;
  }

  get buildingNumber() : string | null {
    return this._buildingNumber;
  }
  set buildingNumber(value: string | null) {
    this._buildingNumber = value;
    this._isDirty = true;
  }

  get attention() : string | null {
    return this._attention;
  }
  set attention(value: string | null) {
    this._attention = value;
    this._isDirty = true;
  }

  get isAppliedToAll() : boolean {
    return this._isAppliedToAll;
  }
  set isAppliedToAll(value: boolean) {
    this._isAppliedToAll = value;
    this._isDirty = true;
  }

  get description() : string | null {
    return this._description;
  }
  set description(value: string | null) {
    this._description = value;
    this._isDirty = true;
  }

  get premisesNumber() : number | null {
    return this._locationNumber;
  }
  set premisesNumber(value: number | null) {
    this._locationNumber= value;
    this._isDirty = true;
  }

  get propertyQuoteId() : number | null {
    return this._propertyQuoteId;
  }

  set propertyQuoteId(value: number | null) {
    this._propertyQuoteId = value;
    this._isDirty = true;
  }

  get propertyQuoteAdditionalInterestId(): number | null {
    return this._propertyQuoteAdditionalInterestId;
  }

  set propertyQuoteAdditionalInterestId(value: number | null) {
    this._propertyQuoteAdditionalInterestId = value;
    this._isDirty = true;
  }

  get interest() : string | null {
    return this._interest;
  }
  set interest(value: string | null) {
    this._interest = value;
    this._isDirty = true;
  }

  get street1() : string | null {
    return this._street1;
  }
  set street1(value: string | null) {
    this._street1 = value;
    this._isDirty = true;
  }

  get street2() : string | null {
    return this._street2;
  }
  set street2(value: string | null) {
    this._street2 = value;
    this._isDirty = true;
  }

  get city() : string | null {
    return this._city;
  }
  set city(value: string | null) {
    this._city = value;
    this._isDirty = true;
  }

  get state() : string | null {
    return this._state;
  }
  set state(value: string | null) {
    this._state = value;
    this._isDirty = true;
  }

  get zip() : string | null {
    return this._zip;
  }
  set zip(value: string | null) {
    this._zip = value;
    this._isDirty = true;
  }

  get countryCode() : string | null {
    return this._countryCode;
  }
  set countryCode(value: string | null) {
    this._countryCode = value;
    this._isDirty = true;
  }

  get isDirty() : boolean {
    return this._isDirty;
  }

  set isDity(value: boolean) {
    this._isDirty = value;
  }

  get isValid(): boolean {
    const valid = true;
    //valid = this.validate(valid);
    return valid;
  }

  set isValid(value: boolean){
    this.isValid = value;
  }

  markClean() {
    this._isDirty = false;
  }
  markDirty() {
    this._isDirty = true;
  }

}


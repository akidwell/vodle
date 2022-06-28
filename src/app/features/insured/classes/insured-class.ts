import { DatePipe } from '@angular/common';
import { CountryEnum } from 'src/app/core/enums/country-enum';
import { State } from 'src/app/core/models/state';
import { ZipCodeCountry } from 'src/app/core/utils/zip-code-country';
import { AdditionalNamedInsuredData, insuredANI } from 'src/app/shared/components/additional-named-insured/additional-named-insured';
import { Insured } from '../models/insured';
import { InsuredContact } from '../models/insured-contact';
import { InsuredContactClass } from './insured-contact-class';


export class InsuredClass implements Insured {
  private _name: string | null = null;
  private _formerName1: string | null = null;
  private _formerName2: string | null = null;
  private _sicCode: string | null = null;
  private _naicsCode: string | null = null;
  private _entityType: number | null = null;
  private _street1: string | null = null;
  private _street2: string | null = null;
  private _city: string | null = null;
  private _state: string | null = null;
  private _zip: string | null = null;
  private _county: string | null = null;
  private _country: string | null = null;
  private _website: string | null = null;
  private _comments: string | null = null;
  private _isAddressOverride = false;
  private _fein: string | null = null;
  private _addressVerifiedDate: Date| null = null;
  private _insured: Insured | undefined;
  private _isDirty = false;
  private _initializerIsStale = false;
  private _showErrors = false;

  isNew = false;
  contacts: InsuredContactClass[] = [];
  additionalNamedInsureds: insuredANI[] = [];
  insuredCode: number | null = null;
  customerCode: number | null = null;
  createdBy: string | null = null;
  createdDate: Date | null = null;
  modifiedBy: string | null = null;
  modifiedDate: Date | null = null;
  isZipLookup = false;
  isVerifying = false;

  nameRequired = true;
  street1Required = true;
  street2Required = false;
  cityRequired = true;
  stateRequired = true;
  zipRequired = true;
  countyRequired = false;
  countryRequired = true;
  isAddressOverrideRequired = false;
  formerName1Required = false;
  formerName2Required = false;
  commentsRequired = false;
  insuredCodeRequired = false;
  customerCodeRequired = false;
  entityTypeRequired = false;
  feinRequired = false;
  websiteRequired = false;
  createdByRequired = false;
  ModifiedByRequired = false;

  get street1Readonly(): boolean {
    return this.isZipLookup || this.isVerifying;
  }
  get street2Readonly(): boolean {
    return this.isZipLookup || this.isVerifying;
  }
  get cityReadonly(): boolean {
    return this.isZipLookup || this.isVerifying;
  }
  get stateReadonly(): boolean {
    return this.isZipLookup || this.isVerifying;
  }
  get zipReadonly(): boolean {
    return this.isZipLookup || this.isVerifying;
  }
  get countyReadonly(): boolean {
    return this.isZipLookup || this.isVerifying;
  }
  get countryReadonly(): boolean {
    return this.isZipLookup || this.isVerifying;
  }
  nameReadonly = false;
  isAddressOverrideReadonly = false;
  formerName1Readonly = false;
  formerName2Readonly = false;
  commentsReadonly = false;
  insuredCodeReadonly = true;
  customerCodeReadonly = true;
  entityTypeReadonly = false;
  feinReadonly = false;
  websiteReadonly = false;
  createdByReadonly = true;
  ModifiedByReadonly = true;

  invalidList: string[] = [];

  get name(): string | null {
    return this._name;
  }
  set name(value: string | null) {
    this._name = value;
    this._isDirty = true;
  }
  get formerName1(): string | null {
    return this._formerName1;
  }
  set formerName1(value: string | null) {
    this._formerName1 = value;
    this._isDirty = true;
  }
  get formerName2(): string | null {
    return this._formerName2;
  }
  set formerName2(value: string | null) {
    this._formerName2 = value;
    this._isDirty = true;
  }
  get sicCode(): string | null {
    return this._sicCode;
  }
  set sicCode(value: string | null) {
    this._sicCode = value;
    this._isDirty = true;
  }
  get naicsCode(): string | null {
    return this._naicsCode;
  }
  set naicsCode(value: string | null) {
    this._naicsCode = value;
    this._isDirty = true;
  }
  get entityType(): number | null {
    return this._entityType;
  }
  set entityType(value: number | null) {
    this._entityType = value;
    this._isDirty = true;
  }
  get street1(): string | null {
    return this._street1;
  }
  set street1(value: string | null) {
    this._street1 = value;
    this.addressVerifiedDate = null;
    this._isDirty = true;
  }
  get street2(): string | null {
    return this._street2;
  }
  set street2(value: string | null) {
    this._street2 = value;
    this.addressVerifiedDate = null;
    this._isDirty = true;
  }
  get city(): string | null {
    return this._city;
  }
  set city(value: string | null) {
    this._city = value;
    this.addressVerifiedDate = null;
    this._isDirty = true;
  }
  get state(): string | null {
    return this._state;
  }
  set state(value: string | null) {
    this._state = value;
    this.addressVerifiedDate = null;
    this._isDirty = true;
  }
  get zip(): string | null {
    return this._zip;
  }
  set zip(value: string | null) {
    this._zip = value;
    this.addressVerifiedDate = null;
    this._isDirty = true;
  }
  get county(): string | null {
    return this._county;
  }
  set county(value: string | null) {
    this._county = value;
    this.addressVerifiedDate = null;
    this._isDirty = true;
  }
  get country(): string | null {
    return this._country;
  }
  set country(value: string | null) {
    this._country = value;
    this.addressVerifiedDate = null;
    this._isDirty = true;
  }
  get website(): string | null {
    return this._website;
  }
  set website(value: string | null) {
    this._website = value;
    this._isDirty = true;
  }
  get comments(): string | null {
    return this._comments;
  }
  set comments(value: string | null) {
    this._comments = value;
    this._isDirty = true;
  }
  get isAddressOverride(): boolean {
    return this._isAddressOverride;
  }
  set isAddressOverride(value: boolean) {
    this._isAddressOverride = value;
    this.addressVerifiedDate = null;
    this._isDirty = true;
  }
  get fein(): string | null {
    return this._fein;
  }
  set fein(value: string | null) {
    this._fein = value;
    this._isDirty = true;
  }
  get addressVerifiedDate(): Date | null {
    return this._addressVerifiedDate;
  }
  set addressVerifiedDate(value: Date | null) {
    this._addressVerifiedDate = value;
    this._isDirty = true;
  }
  get isDirty(): boolean {
    return this._isDirty || this.additionalNamedInsureds.some(item => item.isDirty) || this.contacts.some(item => item.isDirty);
  }
  get showErrors(): boolean {
    return this._showErrors && this.invalidList.length > 0;
  }
  get isValid(): boolean {
    let valid = true;
    valid = this.validate(valid);
    return valid;
  }
  get initializerIsStale() : boolean {
    return this._initializerIsStale;
  }
  set initializerIsStale(value: boolean) {
    this._initializerIsStale = value;
  }
  private datepipe = new DatePipe('en-US');

  get createUserFormatted(): string | null {
    if ((this.createdBy ?? '') != '') {
      return this.createdBy + ' - ' + this.datepipe.transform(this.createdDate, 'MM/dd/YYYY h:mm:ss a');
    }
    return null;
  }

  get modifiedUserFormatted(): string | null {
    if ((this.modifiedBy ?? '') != '') {
      return this.modifiedBy + ' - ' + this.datepipe.transform(this.modifiedDate, 'MM/dd/YYYY h:mm:ss a');
    }
    return null;
  }

  constructor(insured?: Insured) {
    this._insured = insured;
    this.init(insured);
  }
  init(insured?: Insured){
    this._name = insured?.name || null;
    this._formerName1 = insured?.formerName1 || null;
    this._formerName2 = insured?.formerName2 || null;
    this._sicCode = insured?.sicCode || null;
    this._naicsCode = insured?.naicsCode || null;
    this._entityType = insured?.entityType || null;
    this._street1 = insured?.street1 || null;
    this._street2 = insured?.street2 || null;
    this._city = insured?.city || null;
    this._state = insured?.state || null;
    this._zip = insured?.zip || null;
    this._county = insured?.county || null;
    this._country = insured?.country || null;
    this._website = insured?.website || null;
    this._comments = insured?.comments || null;
    this._isAddressOverride = insured?.isAddressOverride ?? false;
    this._fein = insured?.fein || null;
    this._addressVerifiedDate = insured?.addressVerifiedDate || null;
    this.insuredCode = insured?.insuredCode || null;
    this.customerCode = insured?.customerCode || null;
    this.createdBy = insured?.createdBy || null;
    this.createdDate = insured?.createdDate || null;
    this.modifiedBy = insured?.modifiedBy || null;
    this.modifiedDate = insured?.modifiedDate || null;
    this.isNew = insured == null ? true : insured.isNew ?? false;

    const contacts: InsuredContactClass[] = [];
    insured?.contacts?.forEach(element => {
      contacts.push(new InsuredContactClass(element));
    });
    this.contacts = contacts;

    this.additionalNamedInsureds = insured?.additionalNamedInsureds || [];
    this.setReadonlyFields();
    this.setRequiredFields();
  }
  markClean() {
    this._isDirty = false;
    this._showErrors = false;
  }
  markDirty() {
    this._isDirty = true;
  }
  showErrorMessage() {
    this._showErrors = true;
  }
  hideErrorMessage() {
    this._showErrors = false;
  }
  setRequiredFields() {
    // No special rules
  }
  setReadonlyFields() {
    // No special rules
  }

  validate(valid: boolean): boolean {
    this.invalidList = [];
    if (!this.validateName()) {
      valid = false;
    }
    if (!this.validateStreet1()) {
      valid = false;
    }
    if (!this.validateZip()) {
      valid = false;
    }
    if (!this.validateCity()) {
      valid = false;
    }
    if (!this.validateState()) {
      valid = false;
    }
    if (!this.validateCountry()) {
      valid = false;
    }
    if (!this.validateFEIN()) {
      valid = false;
    }
    if (!this.validateAddress()) {
      valid = false;
    }
    if (!this.validateContacts()) {
      valid = false;
    }
    if (!this.validateANI()) {
      valid = false;
    }
    this.contacts.forEach(c => {
      if (!c.validate(valid)) {
        valid = false;
        this.invalidList = this.invalidList.concat(c.invalidList);
      }
    });
    this.additionalNamedInsureds.forEach(c => {
      if (!c.validate(valid)) {
        valid = false;
        this.invalidList = this.invalidList.concat(c.invalidList);
      }
    });
    return valid;
  }

  get errorMessage() {
    let message = '';
    this.invalidList.forEach(error => {
      message += '<br><li>' + error;
    });
    return 'Following fields are invalid' + message;
  }

  validateName(): boolean {
    let valid = true;
    if (!this.name) {
      valid = false;
      this.invalidList.push('First Named Insured is required.');
    }
    return valid;
  }
  validateStreet1(): boolean {
    let valid = true;
    if (!this.street1) {
      valid = false;
      this.invalidList.push('Street Address is required.');
    }
    return valid;
  }
  validateZip(): boolean {
    let valid = true;

    if (!this.zip) {
      valid = false;
      this.invalidList.push('Zip code is required.');
    }
    else if (this.country != ZipCodeCountry(this.zip)) {
      valid = false;
      this.invalidList.push('Zip Code is invalid for ' +this.country);
    }
    return valid;
  }
  validateCity(): boolean {
    let valid = true;
    if (!this.city) {
      valid = false;
      this.invalidList.push('City is required.');
    }
    return valid;
  }
  validateState(): boolean {
    let valid = true;
    if (!this.state) {
      valid = false;
      this.invalidList.push('State is required.');
    }
    return valid;
  }
  validateCountry(): boolean {
    let valid = true;
    if (!this.country) {
      valid = false;
      this.invalidList.push('Country is required.');
    }
    return valid;
  }
  validateFEIN(): boolean {
    let valid = true;
    if (this.fein && this.fein?.length != 9) {
      valid = false;
      this.invalidList.push('FEIN is invalid.');
    }
    return valid;
  }
  validateAddress(): boolean {
    let valid = true;
    if (!this.isAddressOverride && this.addressVerifiedDate == null) {
      valid = false;
      this.invalidList.push('Address is not Verified.');
    }
    return valid;
  }
  validateContacts(): boolean {
    let dupe = false;
    this.contacts.forEach(c => c.isDuplicate = false);
    this.contacts.forEach(x => {
      if (!x.isDuplicate) {
        const dupes = this.contacts.filter(c => c.firstName == x.firstName && c.lastName == x.lastName && c.email == x.email && c.phone == x.phone && c.fax == x.fax);
        if (dupes.length > 1) {
          dupes.forEach(d => d.isDuplicate = true);
          dupe = true;
          this.invalidList.push('Contact: ' + (x.firstName + ' ' + x.lastName).trim() + ' is duplicated.');
        }
      }
    });
    return !dupe;
  }
  validateANI(): boolean {
    let dupe = false;
    this.additionalNamedInsureds.forEach(a => a.isDuplicate = false);
    this.additionalNamedInsureds.forEach(x => {
      if (!x.isDuplicate) {
        const dupes = this.additionalNamedInsureds.filter(c => c.role == x.role && c.name == x.name);
        if (dupes.length > 1) {
          dupes.forEach(d => d.isDuplicate = true);
          dupe = true;
          this.invalidList.push('Additional Named Insured: ' + (x.role + ' - ' + x.name).trim() + ' is duplicated.');
        }
      }
    });
    return !dupe;
  }
  resetClass(){
    this.init(this._insured);
  }
  updateClass(insured?: Insured){
    this._insured = insured;
    this.init(this._insured);
  }
  toJSON() {
    const contacts: InsuredContact[] = [];
    this.contacts.forEach(c => contacts.push(c.toJSON()));
    const ani: AdditionalNamedInsuredData[] = [];
    this.additionalNamedInsureds.forEach(c => ani.push(c.toJSON()));
    return {
      insuredCode: this.insuredCode,
      name: this.name,
      formerName1: this.formerName1,
      formerName2: this.formerName2,
      sicCode: this.sicCode,
      naicsCode: this.naicsCode,
      entityType: this.entityType,
      street1: this.street1,
      street2: this.street2,
      city: this.city,
      state: this.state,
      zip: this.zip,
      county: this.county,
      country: this.country,
      website: this.website,
      comments: this.comments,
      customerCode: this.customerCode,
      isAddressOverride: this.isAddressOverride,
      addressVerifiedDate: this.addressVerifiedDate,
      fein: this.fein,
      createdBy: this.createdBy,
      createdDate: this.createdDate,
      modifiedBy: this.modifiedBy,
      modifiedDate: this.modifiedDate,
      isNew: this.isNew,
      contacts: contacts,
      additionalNamedInsureds: ani
    };
  }
}

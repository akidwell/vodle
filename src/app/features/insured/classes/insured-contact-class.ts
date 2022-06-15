import { InsuredContact } from '../models/insured-contact';

export class InsuredContactClass implements InsuredContact {
  insuredContactId: number | null = null;
  insuredCode: number | null = null;
  isNew = false;
  isPrimaryTracked = false;
  private _sequence: number | null = null;
  private _isPrimary: boolean | null = null;
  private _firstName: string | null = null;
  private _lastName: string | null = null;
  private _email: string | null = null;
  private _phone: string | null = null;
  private _fax: string | null = null;
  private _isDirty = false;
  invalidList: string[] = [];
  isDuplicate = false;

  get sequence() : number | null {
    return this._sequence;
  }
  set sequence(value: number | null) {
    this._sequence = value;
    this._isDirty = true;
  }
  get isPrimary() : boolean | null {
    return this._isPrimary;
  }
  set isPrimary(value: boolean | null) {
    this._isPrimary = value;
    this._isDirty = true;
  }
  get firstName() : string | null {
    return this._firstName;
  }
  set firstName(value: string | null) {
    this._firstName = value;
    this._isDirty = true;
  }
  get lastName() : string | null {
    return this._lastName;
  }
  set lastName(value: string | null) {
    this._lastName = value;
    this._isDirty = true;
  }
  get email() : string | null {
    return this._email;
  }
  set email(value: string | null) {
    this._email = value;
    this._isDirty = true;
  }
  get phone() : string | null {
    return this._phone;
  }
  set phone(value: string | null) {
    this._phone = value;
    this._isDirty = true;
  }
  get fax() : string | null {
    return this._fax;
  }
  set fax(value: string | null) {
    this._fax = value;
    this._isDirty = true;
  }
  get isDirty() : boolean {
    return this._isDirty;
  }
  get isValid(): boolean {
    let valid = true;
    valid = this.validate(valid);
    return valid;
  }

  constructor(contact?: InsuredContact){
    this.insuredCode = contact?.insuredCode || null;
    this.insuredContactId = contact?.insuredContactId || null;
    this._sequence = contact?.sequence || null;
    this._isPrimary = contact?.isPrimary || false;
    this._firstName = contact?.firstName || null;
    this._lastName = contact?.lastName || null;
    this._email = contact?.email || null;
    this._phone = contact?.phone || null;
    this._fax = contact?.fax || null;
    this.isPrimaryTracked = contact?.isPrimaryTracked || false;
    this.isNew = contact == null ? true: false;

    this.setReadonlyFields();
    this.setRequiredFields();
  }

  markClean() {
    this._isDirty = false;
  }
  markDirty() {
    this._isDirty = true;
  }
  setRequiredFields(){
    // Do Nothing
  }
  setReadonlyFields() {
    // Do Nothing
  }
  validate(valid: boolean): boolean {
    this.invalidList = [];
    if (!this.validateFirstName()) {
      valid = false;
    }
    if (!this.validateLastName()) {
      valid = false;
    }
    if (!this.validatePhone()) {
      valid = false;
    }
    if (!this.validateFax()) {
      valid = false;
    }
    return valid;
  }
  validateFirstName(): boolean {
    let valid = true;
    if (!this.firstName) {
      valid = false;
      this.invalidList.push('First Name is required for Contact #' + this.sequence);
    }
    return valid;
  }
  validateLastName(): boolean {
    let valid = true;
    if (!this.lastName) {
      valid = false;
      this.invalidList.push('Last Name is required for Contact #' + this.sequence);
    }
    return valid;
  }
  validatePhone(): boolean {
    let valid = true;
    if (this.phone && this.phone?.length != 10 ) {
      valid = false;
      this.invalidList.push('Phone is invalid for Contact #' + this.sequence);
    }
    return valid;
  }
  validateFax(): boolean {
    let valid = true;
    if (this.fax && this.fax?.length != 10 ) {
      valid = false;
      this.invalidList.push('Fax is invalid for Contact #' + this.sequence);
    }
    return valid;
  }

  toJSON() {
    return {
      insuredContactId: this.insuredContactId,
      insuredCode: this.insuredCode,
      sequence: this.sequence,
      isPrimary: this.isPrimary,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      fax: this.fax,
      isNew: this.isNew,
      isPrimaryTracked: this.isPrimaryTracked
    };
  }
}
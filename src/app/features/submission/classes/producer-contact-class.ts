import * as moment from 'moment';
import { Moment } from 'moment';
import { ProducerContact } from '../models/producer-contact';

export class ProducerContactClass implements ProducerContact {
  private _firstName = '';
  private _lastName = '';
  private _email = '';
  private _phone = '';
  private _fax = '';
  private _contactId: number | null = null;
  private _producerCode: number | null = null;
  private _closedDate: Date | Moment | null = null;
  private _display = '';
  private _isActive = true;

  get firstName() : string {
    return this._firstName;
  }
  set firstName(value: string) {
    this._firstName = value;
  }
  get lastName() : string {
    return this._lastName;
  }
  set lastName(value: string) {
    this._lastName = value;
  }
  get email() : string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }
  get phone() : string {
    return this._phone;
  }
  set phone(value: string) {
    this._phone = value;
  }
  get fax() : string {
    return this._fax;
  }
  set fax(value: string) {
    this._fax = value;
  }
  get contactId(): number | null{
    return this._contactId;
  }
  get producerCode(): number | null{
    return this._producerCode;
  }
  get display(): string {
    return this._display;
  }
  get closedDate(): Date | moment.Moment | null {
    return this._closedDate;
  }
  get isActive(): boolean {
    return this._isActive;
  }
  constructor(contact?: ProducerContact, producer?: number) {
    this.init(contact, producer);
  }
  init(contact?: ProducerContact, producer?: number) {
    this._firstName = contact?.firstName || '';
    this._lastName = contact?.lastName || '';
    this._email = contact?.email || '';
    this._phone = contact?.phone || '';
    this._fax = contact?.fax || '';
    this._contactId = contact?.contactId || null;
    this._producerCode = contact?.producerCode || producer || null;
    this._closedDate = contact?.closedDate || null;
    this._display = this._firstName + '\xa0' + this._lastName + '\xa0\xa0\xa0' + this._email + (this._phone ? '\xa0\xa0\xa0' + this.createPhoneDisplay() : '');
    this._isActive = contact?.closedDate == null || moment(contact?.closedDate) > moment();
  }
  get isValid(): boolean {
    let valid = true;
    const invalidList = [];
    if (this._producerCode == null || this._producerCode == 0) {
      valid = false;
      invalidList.push('No producer selected');
    }
    if (!this._firstName) {
      valid = false;
      invalidList.push('No First Name provided');
    }
    if (!this._lastName) {
      valid = false;
      invalidList.push('No Last Name provided');
    }
    if (!this._email) {
      valid = false;
      invalidList.push('No Email provided');
    }
    return valid;
  }
  reactivate() {
    this._closedDate = null;
    this._isActive = true;
  }
  deactivate() {
    this._closedDate = moment().startOf('day');
    this._isActive = false;
  }
  toggleActive() {
    if (this.isActive) {
      this.deactivate();
    } else {
      this.reactivate();
    }
  }
  createPhoneDisplay() {
    const phoneMask = this.phone.match(/(\d{3})(\d{3})(\d{4})/) || '';
    return '(' + phoneMask[1] + ') ' + phoneMask[2] + '-' + phoneMask[3];
  }
  resetClass(contact?: ProducerContact, producer?: number) {
    this.init(contact, producer);
  }
  toJSON() {
    return {
      contactId: this._contactId || 0,
      producerCode: this._producerCode,
      closedDate: this._closedDate,
      firstName: this._firstName,
      lastName: this._lastName,
      email: this._email,
      phone: this._phone,
      fax: this._fax
    };
  }
}

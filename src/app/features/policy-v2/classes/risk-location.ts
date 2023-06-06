import { RiskLocation } from '../../policy/models/policy';
import { ChildBaseClass } from './base/child-base-class';
import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';

export class RiskLocationClass extends ChildBaseClass implements RiskLocation {
  constructor(policy?: RiskLocation) {
    super();
    if (policy) {
      this.existingInit(policy);
    } else {
      this.newInit();
    }
    //this.setWarnings();
  }

  private _city = '';
  get city() : string {
    return this._city;
  }
  set city(value: string) {
    this._city = value;
    this.markDirty();
  }

  private _state ='';
  get state() : string {
    return this._state;
  }
  set state(value: string) {
    this._state = value;
    this.markDirty();
  }

  private _zip ='';
  get zip() : string {
    return this._zip;
  }
  set zip(value: string ) {
    this._zip = value;
    this.markDirty();
  }

  private _street ='';
  get street() : string {
    return this._street;
  }
  set street(value: string ) {
    this._street = value;
    this.markDirty();
  }

  private _taxCode ='';
  get taxCode() : string {
    return this._taxCode;
  }
  set taxCode(value: string ) {
    this._taxCode = value;
    this.markDirty();
  }

  private _countryCode ='';
  get countryCode() : string {
    return this._countryCode;
  }
  set countryCode(value: string ) {
    this._countryCode = value;
    this.markDirty();
  }

  private _policyId ='';
  get policyId() : string {
    return this._policyId;
  }
  set policyId(value: string ) {
    this._policyId = value;
    this.markDirty();
  }

  existingInit(loc: RiskLocation) {
    this._policyId = loc.policyId;
    this._city = loc.city;
    this._state = loc.state;
    this._zip = loc.zip;
    this._street = loc.street;
    this._countryCode = loc.countryCode;
    this._taxCode = loc.taxCode;
    this.guid = crypto.randomUUID();
    this.isNew = false;
  }

  newInit(){
    this.city = '';
    this.state = '';
    this.zip = '';
    this.guid = crypto.randomUUID();
    this.isNew = true;
  }

  validate(): ErrorMessage[]{
    if (this.isDirty){
      //TODO: class based validation checks
      this.errorMessages = [];
      this.canBeSaved = true;
      this.isValid = true;
      console.log(this.city);
      if(this.city == ''){
        this.createErrorMessage('City is required.');
      }
    }
    return this.errorMessages;
  }

  onGuidNewMatch(T: ChildBaseClass): void {
    throw new Error('Method not implemented.');
  }
  onGuidUpdateMatch(T: ChildBaseClass): void {
    throw new Error('Method not implemented.');
  }

  toJSON(): RiskLocation {
    return {
      city: this.city,
      state: this.state,
      zip: this.zip,
      street: this.street,
      policyId: this.policyId,
      taxCode: this.taxCode,
      countryCode: this.countryCode
    };
  }

}

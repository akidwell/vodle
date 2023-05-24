import { lastValueFrom } from 'rxjs';
import { InsuredService } from 'src/app/features/insured/services/insured-service/insured.service';
import { ChildBaseClass } from 'src/app/features/policy-v2/classes/base/child-base-class';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { ErrorMessage } from '../../interfaces/errorMessage';

export interface AdditionalNamedInsuredData {
  policyId: number;
  endorsementNo: number;
  addInsuredCode: number | null;
  insuredCode?: number | null;
  sequenceNo: number;
  role: number | null;
  name: string | null;
  createdDate?: Date | null;
  isActive?: boolean | null;
  canDelete?: boolean | null;
  isNew: boolean;
}

export interface AdditionalNamedInsured extends AdditionalNamedInsuredData {
  showActive: boolean;
  isDuplicate: boolean;
  save(): Promise<boolean>;
  delete(): Promise<boolean>;
  clone(): AdditionalNamedInsured;
  copy(): AdditionalNamedInsured;
  get isValid(): boolean;
  get isDirty() : boolean;
  invalidList: string[];
}

export class coverageANI implements AdditionalNamedInsured {
  policyId = 0;
  endorsementNo = 0;
  addInsuredCode: number | null = null;
  insuredCode?: number;
  createdDate?: Date | null;
  isNew = false;
  isActive?: boolean;
  showActive = false;
  canDelete = true;
  isDuplicate = false;
  invalidList: string[] = [];
  private _sequenceNo = 0;
  private _role: number | null = null;
  private _name: string | null = null;

  constructor(private policyService: PolicyService, ani?: AdditionalNamedInsured) {
    this.policyId = ani?.policyId ?? 0;
    this.endorsementNo = ani?.endorsementNo ?? 0;
    this._sequenceNo = ani?.sequenceNo ?? 0;
    this._role = ani?.role || null;
    this._name = ani?.name || null;
    this.createdDate = ani?.createdDate;
    this.isNew = ani?.isNew ?? false;
  }

  // get key1() { return this.policyId; }
  // set key1(value: number) { this.policyId = value; }

  // get key2() { return this.endorsementNo; }
  // set key2(value: number) { this.endorsementNo = value; }

  private _isDirty = false;

  get sequenceNo() : number {
    return this._sequenceNo;
  }
  set sequenceNo(value: number) {
    this._sequenceNo = value;
    this._isDirty = true;
  }
  get role() : number | null {
    return this._role;
  }
  set role(value: number | null) {
    this._role = value;
    this._isDirty = true;
  }
  get name() : string | null {
    return this._name;
  }
  set name(value: string | null) {
    this._name = value;
    this._isDirty = true;
  }
  get isDirty() : boolean {
    return this._isDirty;
  }

  markClean() {
    this._isDirty = false;
  }
  markDirty() {
    this._isDirty = true;
  }

  async save(): Promise<boolean> {
    if (this.isNew) {
      const ani = this.toJSON();
      const results$ = this.policyService.addAdditionalNamedInsured(ani);
      await lastValueFrom(results$).then(result => {
        if (result) {
          this.createdDate = result.createdDate;
          this.isNew = false;
          this.markClean();
        }
      });
    }
    else {
      const ani = this.toJSON();
      const results$ = this.policyService.updateAdditionalNamedInsured(ani);
      await lastValueFrom(results$).then(() => {
        this.isNew = false;
        this.markClean();
      });
    }
    return true;
  }

  async delete(): Promise<boolean> {
    const ani = this.toJSON();
    const results$ = this.policyService.deleteAdditionalNamedInsured(ani);
    return await lastValueFrom(results$);
  }

  clone(): coverageANI {
    const clone: coverageANI = Object.create(this);
    clone.createdDate = null;
    clone.isNew = true;
    return clone;
  }

  copy(): coverageANI {
    const copy: coverageANI = Object.create(this);
    copy.name = 'CopyOf ' + this.name;
    copy.createdDate = null;
    copy.isNew = true;
    return copy;
  }

  get isValid(): boolean {
    let valid = true;
    valid = this.validate(valid);
    return valid;
  }
  validate(valid: boolean): boolean {
    this.invalidList = [];
    if (!this.validateRole()) {
      valid = false;
    }
    if (!this.validateName()) {
      valid = false;
    }
    return valid;
  }

  validateRole(): boolean {
    let valid = true;
    if (!this.role) {
      valid = false;
      this.invalidList.push('Role is required for ANI #' + this.sequenceNo);
    }
    return valid;
  }
  validateName(): boolean {
    let valid = true;
    if (!this.name) {
      valid = false;
      this.invalidList.push('Name is required for ANI #' + this.sequenceNo);
    }
    return valid;
  }

  toJSON() {
    return {
      policyId: this.policyId,
      endorsementNo: this.endorsementNo,
      addInsuredCode: this.addInsuredCode,
      insuredCode: this.insuredCode,
      sequenceNo: this.sequenceNo,
      role: this.role,
      name: this.name,
      isNew: this.isNew
    };
  }
}

export class insuredANI implements AdditionalNamedInsured {
  policyId = 0;
  addInsuredCode: number | null = null;
  insuredCode = 0;
  endorsementNo = 0;
  createdDate?: Date | null;
  isNew = false;
  canDelete?: boolean = false;
  showActive = true;
  private _isDirty = false;
  invalidList: string[] = [];
  isDuplicate = false;

  private _sequenceNo = 0;
  private _role: number | null = null;
  private _name: string | null = null;
  private _isActive: boolean | null = null;

  get sequenceNo() : number {
    return this._sequenceNo;
  }
  set sequenceNo(value: number) {
    this._sequenceNo = value;
    this._isDirty = true;
  }
  get role() : number | null {
    return this._role;
  }
  set role(value: number | null) {
    this._role = value;
    this._isDirty = true;
  }
  get name() : string | null {
    return this._name;
  }
  set name(value: string | null) {
    this._name = value;
    this._isDirty = true;
  }
  get isActive() : boolean | null {
    return this._isActive;
  }
  set isActive(value: boolean | null) {
    this._isActive = value;
    this._isDirty = true;
  }
  get isDirty() : boolean {
    return this._isDirty;
  }

  // get key1() { return this.addInsuredCode ?? 0;}
  // set key1(value: number) { this.addInsuredCode = value; }

  // get key2() { return this.insuredCode; }
  // set key2(value: number) { this.insuredCode = value; }

  constructor(private insuredService: InsuredService, ani?: AdditionalNamedInsured) {
    this._name = ani?.name || null;
    this._role = ani?.role || null;
    this._isActive = ani?.isActive ?? null;
    this.policyId = ani?.policyId ?? 0;
    this.addInsuredCode = ani?.addInsuredCode ?? null;
    this.insuredCode = ani?.insuredCode ?? 0;
    this.endorsementNo = ani?.endorsementNo ?? 0;
    this._sequenceNo = ani?.sequenceNo ?? 0;
    this.canDelete = ani?.canDelete ?? true;
    this.createdDate = ani?.createdDate;
    this.isNew = ani?.isNew ?? false;
  }



  markClean() {
    this._isDirty = false;
  }
  markDirty() {
    this._isDirty = true;
  }
  async save(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  get isValid(): boolean {
    let valid = true;
    valid = this.validate(valid);
    return valid;
  }
  validate(valid: boolean): boolean {
    this.invalidList = [];
    if (!this.validateRole()) {
      valid = false;
    }
    if (!this.validateName()) {
      valid = false;
    }
    return valid;
  }

  validateRole(): boolean {
    let valid = true;
    if (!this.role) {
      valid = false;
      this.invalidList.push('Role is required for ANI #' + this.sequenceNo);
    }
    return valid;
  }
  validateName(): boolean {
    let valid = true;
    if (!this.name) {
      valid = false;
      this.invalidList.push('Name is required for ANI #' + this.sequenceNo);
    }
    return valid;
  }

  async delete(): Promise<boolean> {
    const results$ = this.insuredService.deleteInsuredAdditionalNamedInsured(this);
    return await lastValueFrom(results$);
  }

  clone(): insuredANI {
    const clone: insuredANI = Object.create(this);
    clone.addInsuredCode = null;
    clone.createdDate = null;
    clone.isNew = true;
    clone.isActive = true;
    return clone;
  }

  copy(): insuredANI {
    const copy: insuredANI = Object.create(this);
    copy.addInsuredCode = null;
    copy.name = 'CopyOf ' + this.name;
    copy.createdDate = null;
    copy.isNew = true;
    copy.isActive = true;
    return copy;
  }

  toJSON() {
    return {
      policyId: this.policyId,
      endorsementNo: this.endorsementNo,
      addInsuredCode: this.addInsuredCode,
      insuredCode: this.insuredCode,
      sequenceNo: this.sequenceNo,
      role: this.role,
      name: this.name,
      isActive: this.isActive,
      isNew: this.isNew
    };
  }
}

export class PolicyANIClass extends ChildBaseClass implements AdditionalNamedInsured {
  onGuidNewMatch(T: ChildBaseClass): void {
    throw new Error('Method not implemented.');
  }
  onGuidUpdateMatch(T: ChildBaseClass): void {
    throw new Error('Method not implemented.');
  }
  policyId = 0;
  addInsuredCode: number | null = null;
  insuredCode = 0;
  endorsementNo = 0;
  createdDate?: Date | null;
  isNew = false;
  canDelete?: boolean = false;
  showActive = true;
  invalidList: string[] = [];
  isDuplicate = false;
  markedForDeletion = false;

  private _sequenceNo = 0;
  private _role: number | null = null;
  private _name: string | null = null;
  private _isActive: boolean | null = null;

  get sequenceNo() : number {
    return this._sequenceNo;
  }
  set sequenceNo(value: number) {
    this._sequenceNo = value;
    this.isDirty = true;
  }
  get role() : number | null {
    return this._role;
  }
  set role(value: number | null) {
    this._role = value;
    this.isDirty = true;
  }
  get name() : string | null {
    return this._name;
  }
  set name(value: string | null) {
    this._name = value;
    this.isDirty = true;
  }
  get isActive() : boolean | null {
    return this._isActive;
  }
  set isActive(value: boolean | null) {
    this._isActive = value;
    this.isDirty = true;
  }

  constructor(ani?: AdditionalNamedInsured) {
    super();
    console.log(ani);
    if(ani){
      this.existingInit(ani);
    }else {
      this.newInit();
    }
  }
  delete(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  clone(): AdditionalNamedInsured {
    const copy: PolicyANIClass = Object.create(this);
    copy.createdDate = null;
    copy.isNew = true;
    copy.isActive = true;
    return copy;
  }

  copy(): AdditionalNamedInsured {
    const copy: PolicyANIClass = Object.create(this);
    copy.addInsuredCode = null;
    copy.name = 'CopyOf ' + this.name;
    copy.createdDate = null;
    copy.isNew = true;
    copy.isActive = true;
    return copy;
  }

  existingInit(ani: AdditionalNamedInsured) {
    this.role = ani.role;
    this.name = ani.name;
  }

  newInit(){
    this.role = null;
    this.name = null;
    this.isNew = true;
  }
  markClean() {
    this.isDirty = false;
  }
  markDirty() {
    this.isDirty = true;
  }
  async save(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  validate(): ErrorMessage[] {
    console.log('VALIDATE');
    this.errorMessages = [];
    this.validateRole();
    this.validateName();
    return this.errorMessages;
  }

  validateRole(): void {
    console.log('ROLE' + this.role);
    if (!this.role) {
      this.createErrorMessage('Role is required for ANI #' + this.sequenceNo);
    }
  }
  validateName(): void {
    if (!this.name) {
      this.createErrorMessage('Name is required for ANI #' + this.sequenceNo);
    }
  }

  toJSON() {
    return {
      policyId: this.policyId,
      endorsementNo: this.endorsementNo,
      addInsuredCode: this.addInsuredCode,
      insuredCode: this.insuredCode,
      sequenceNo: this.sequenceNo,
      role: this.role,
      name: this.name,
      isActive: this.isActive,
      isNew: this.isNew
    };
  }
}


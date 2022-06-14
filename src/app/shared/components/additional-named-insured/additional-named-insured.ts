import { lastValueFrom } from 'rxjs';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { InsuredService } from 'src/app/features/insured/services/insured-service/insured.service';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';

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
  get key1(): number;
  set key1(value: number);
  get key2(): number;
  set key2(value: number);
  showActive: boolean;
  isDuplicate: boolean;
  save(): Promise<boolean>;
  delete(): Promise<boolean>;
  clone(): AdditionalNamedInsured;
  get isValid(): boolean;
  get isDirty() : boolean;
  invalidList: string[];
}

export class coverageANI implements AdditionalNamedInsured {
  policyId = 0;
  endorsementNo = 0;
  addInsuredCode: number | null = null;
  insuredCode?: number;
  sequenceNo = 0;
  createdDate?: Date | null;
  isNew = false;
  isActive?: boolean;
  showActive = false;
  canDelete = true;
  isDuplicate = false;
  invalidList: string[] = [];
  private _role: number | null = null;
  private _name: string | null = null;

  constructor(private policyService: PolicyService, ani?: AdditionalNamedInsured) {
    this.policyId = ani?.policyId ?? 0;
    this.endorsementNo = ani?.endorsementNo ?? 0;
    this.sequenceNo = ani?.sequenceNo ?? 0;
    this._role = ani?.role || null;
    this._name = ani?.name || null;
    this.createdDate = ani?.createdDate;
    this.isNew = ani?.isNew ?? false;
  }

  get key1() { return this.policyId; }
  set key1(value: number) { this.policyId = value; }

  get key2() { return this.endorsementNo; }
  set key2(value: number) { this.endorsementNo = value; }

  private _isDirty = false;

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

  async save(): Promise<boolean> {
    if (this.isNew) {
      const ani = this.toJSON();
      const results$ = this.policyService.addAdditionalNamedInsured(ani);
      await lastValueFrom(results$).then(result => {
        if (result) {
          this.createdDate = result.createdDate;
          this.isNew = false;
        }
      });
    }
    else {
      const ani = this.toJSON();
      const results$ = this.policyService.updateAdditionalNamedInsured(ani);
      await lastValueFrom(results$).then(result => {
        if (result) {
          this.isNew = false;
        }
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
    const copy = deepClone(this);
    copy.createdDate = null;
    copy.isNew = true;
    return new coverageANI(this.policyService,copy);
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
  sequenceNo = 0;
  createdDate?: Date | null;
  isNew = false;
  canDelete?: boolean = false;
  showActive = true;
  private _isDirty = false;
  invalidList: string[] = [];
  isDuplicate = false;

  private _role: number | null = null;
  private _name: string | null = null;
  private _isActive: boolean | null = null;

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

  constructor(private insuredService: InsuredService, ani?: AdditionalNamedInsured) {
    this._name = ani?.name || null;
    this._role = ani?.role || null;
    this._isActive = ani?.isActive ?? null;
    this.policyId = ani?.policyId ?? 0;
    this.addInsuredCode = ani?.addInsuredCode ?? null;
    this.insuredCode = ani?.insuredCode ?? 0;
    this.endorsementNo = ani?.endorsementNo ?? 0;
    this.sequenceNo = ani?.sequenceNo ?? 0;
    this.canDelete = ani?.canDelete ?? true;
    this.createdDate = ani?.createdDate;
    this.isNew = ani?.isNew ?? false;
  }

  get key1() { return this.addInsuredCode ?? 0;}
  set key1(value: number) { this.addInsuredCode = value; }

  get key2() { return this.insuredCode; }
  set key2(value: number) { this.insuredCode = value; }

  async save(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  // async save(): Promise<boolean> {
  //   if (this.isNew) {
  //     const results$ = this.insuredService.addInsuredAdditionalNamedInsured(this);
  //     await lastValueFrom(results$).then(result => {
  //       if (result) {
  //         this.addInsuredCode = result.addInsuredCode;
  //         this.createdDate = result.createdDate;
  //         this.isNew = false;
  //       }
  //     });
  //   }
  //   else {
  //     const results$ = this.insuredService.updateInsuredAdditionalNamedInsured(this);
  //     await lastValueFrom(results$).then(result => {
  //       if (result) {
  //         this.isNew = false;
  //       }
  //     });
  //   }
  //   return true;
  // }

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
    const copy = deepClone(this);
    copy.createdDate = null;
    copy.isNew = true;
    copy.isActive = true;
    return new insuredANI(this.insuredService,copy);
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
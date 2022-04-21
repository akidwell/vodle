import { lastValueFrom } from "rxjs";
import { deepClone } from "src/app/core/utils/deep-clone";
import { InsuredService } from "src/app/features/insured/services/insured-service/insured.service";
import { PolicyService } from "src/app/features/policy/services/policy/policy.service";

export interface AdditionalNamedInsured {
  policyId: number;
  endorsementNo: number;
  addInsuredCode?: number | null;
  insuredCode?: number | null;
  sequenceNo: number;
  role?: number;
  name: string;
  createdDate?: Date | null;
  isActive?: boolean | null;
  isNew: boolean;
  get key1(): number;
  set key1(value: number);
  get key2(): number;
  set key2(value: number);
  showActive: boolean;
  save(): Promise<boolean>;
  delete(): Promise<boolean>;
  clone(): AdditionalNamedInsured;
}


export class coverageANI implements AdditionalNamedInsured {
  policyId: number = 0;
  endorsementNo: number = 0;
  addInsuredCode?: number;
  insuredCode?: number;
  sequenceNo: number = 0;
  role?: number | undefined;
  name: string = "";
  createdDate?: Date | null;
  isNew: boolean = false;
  isActive?: boolean;
  showActive: boolean = false;

  constructor(private policyService: PolicyService, ani?: AdditionalNamedInsured) {
    this.policyId = ani?.policyId ?? 0;
    this.endorsementNo = ani?.endorsementNo ?? 0;
    this.sequenceNo = ani?.sequenceNo ?? 0;
    this.role = ani?.role;
    this.name = ani?.name ?? "";
    this.createdDate = ani?.createdDate;
    this.isNew = ani?.isNew ?? false;
  }

  get key1() { return this.policyId };
  set key1(value: number) { this.policyId = value };

  get key2() { return this.endorsementNo };
  set key2(value: number) { this.endorsementNo = value };

  async save(): Promise<boolean> {
    console.log("coverageANI Save!");

    if (this.isNew) {
      const results$ = this.policyService.addAdditionalNamedInsured(this);
      await lastValueFrom(results$).then(result => {
        if (result) {
          this.createdDate = result.createdDate;
          this.isNew = false;
        }
      });
    }
    else {
      const results$ = this.policyService.updateAdditionalNamedInsured(this);
      await lastValueFrom(results$).then(result => {
        if (result) {
          this.isNew = false;
        }
      });
    }
    return true;
  }

  async delete(): Promise<boolean> {
    const results$ = this.policyService.deleteAdditionalNamedInsured(this);
    return await lastValueFrom(results$);
  }

  clone(): coverageANI {
    let copy = deepClone(this);
    copy.createdDate = null;
    copy.isNew = true;
    return new coverageANI(this.policyService,copy);
  }
}

export class insuredANI implements AdditionalNamedInsured {
  policyId: number = 0;
  addInsuredCode: number = 0;
  insuredCode: number = 0;
  endorsementNo: number = 0;
  sequenceNo: number = 0;
  role?: number | undefined;
  name: string = "";
  createdDate?: Date | null;
  isNew: boolean = false;
  isActive?: boolean = false;
  showActive: boolean = true;

  constructor(private insuredService: InsuredService, ani?: AdditionalNamedInsured) {
    this.policyId = ani?.policyId ?? 0;
    this.addInsuredCode = ani?.addInsuredCode ?? 0;
    this.insuredCode = ani?.insuredCode ?? 0;
    this.endorsementNo = ani?.endorsementNo ?? 0;
    this.sequenceNo = ani?.sequenceNo ?? 0;
    this.role = ani?.role;
    this.name = ani?.name ?? "";
    this.isActive = ani?.isActive ?? true;
    this.createdDate = ani?.createdDate;
    this.isNew = ani?.isNew ?? false;
  }

  get key1() { return this.addInsuredCode };
  set key1(value: number) { this.addInsuredCode = value };

  get key2() { return this.insuredCode };
  set key2(value: number) { this.insuredCode = value };

  async save(): Promise<boolean> {
    console.log("Insured Save!");
    if (this.isNew) {
      const results$ = this.insuredService.addInsuredAdditionalNamedInsured(this);
      await lastValueFrom(results$).then(result => {
        if (result) {
          this.addInsuredCode = result.addInsuredCode;
          this.createdDate = result.createdDate;
          this.isNew = false;
        }
      });
    }
    else {
      const results$ = this.insuredService.updateInsuredAdditionalNamedInsured(this);
      await lastValueFrom(results$).then(result => {
        if (result) {
          this.isNew = false;
        }
      });
    }
    return true;
  }

  async delete(): Promise<boolean> {
    const results$ = this.insuredService.deleteInsuredAdditionalNamedInsured(this);
    return await lastValueFrom(results$);
  }

  clone(): insuredANI {
    let copy = deepClone(this);
    copy.createdDate = null;
    copy.isNew = true;
    return new insuredANI(this.insuredService,copy);
  }
}
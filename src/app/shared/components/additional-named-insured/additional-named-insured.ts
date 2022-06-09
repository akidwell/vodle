import { lastValueFrom } from 'rxjs';
import { deepClone } from 'src/app/core/utils/deep-clone';
import { InsuredService } from 'src/app/features/insured/services/insured-service/insured.service';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';

export interface AdditionalNamedInsured {
  policyId: number;
  endorsementNo: number;
  addInsuredCode: number | null;
  insuredCode?: number | null;
  sequenceNo: number;
  role?: number;
  name: string;
  createdDate?: Date | null;
  isActive?: boolean | null;
  canDelete?: boolean | null;
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
  policyId = 0;
  endorsementNo = 0;
  addInsuredCode: number | null = null;
  insuredCode?: number;
  sequenceNo = 0;
  role?: number | undefined;
  name = '';
  createdDate?: Date | null;
  isNew = false;
  isActive?: boolean;
  showActive = false;
  canDelete = true;


  constructor(private policyService: PolicyService, ani?: AdditionalNamedInsured) {
    this.policyId = ani?.policyId ?? 0;
    this.endorsementNo = ani?.endorsementNo ?? 0;
    this.sequenceNo = ani?.sequenceNo ?? 0;
    this.role = ani?.role;
    this.name = ani?.name ?? '';
    this.createdDate = ani?.createdDate;
    this.isNew = ani?.isNew ?? false;
  }

  get key1() { return this.policyId; }
  set key1(value: number) { this.policyId = value; }

  get key2() { return this.endorsementNo; }
  set key2(value: number) { this.endorsementNo = value; }

  async save(): Promise<boolean> {
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
    const copy = deepClone(this);
    copy.createdDate = null;
    copy.isNew = true;
    return new coverageANI(this.policyService,copy);
  }
}

export class insuredANI implements AdditionalNamedInsured {
  policyId = 0;
  addInsuredCode: number | null = null;
  insuredCode = 0;
  endorsementNo = 0;
  sequenceNo = 0;
  role?: number | undefined;
  name = '';
  createdDate?: Date | null;
  isNew = false;
  isActive?: boolean = false;
  canDelete?: boolean = false;
  showActive = true;

  constructor(private insuredService: InsuredService, ani?: AdditionalNamedInsured) {
    this.policyId = ani?.policyId ?? 0;
    this.addInsuredCode = ani?.addInsuredCode ?? null;
    this.insuredCode = ani?.insuredCode ?? 0;
    this.endorsementNo = ani?.endorsementNo ?? 0;
    this.sequenceNo = ani?.sequenceNo ?? 0;
    this.role = ani?.role;
    this.name = ani?.name ?? '';
    this.isActive = ani?.isActive ?? true;
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

  async delete(): Promise<boolean> {
    const results$ = this.insuredService.deleteInsuredAdditionalNamedInsured(this);
    return await lastValueFrom(results$);
  }

  clone(): insuredANI {
    const copy = deepClone(this);
    copy.createdDate = null;
    copy.isNew = true;
    return new insuredANI(this.insuredService,copy);
  }
}
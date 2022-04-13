import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { PolicyService } from "src/app/features/policy/services/policy/policy.service";

export interface AdditionalNamedInsured {
    policyId: number;
    endorsementNo: number;
    sequenceNo: number;
    role? : number;
    name: string;
    createdBy?: number | null;
    createdDate?: Date | null;
    modifiedBy? : number | null;
    modifiedDate?: Date | null;
    isActive?: boolean | null;
    isNew: boolean;
    get key1() : number;
    set key1(value: number);
    get key2() : number;
    set key2(value: number);
    showActive: boolean;
    save(): Promise<boolean>;
    delete() : void;
  }
    

  export class coverageANI implements AdditionalNamedInsured{
    policyId: number = 0;
    endorsementNo: number = 0;
    sequenceNo: number = 0;
    role?: number | undefined;
    name: string = "";
    createdBy?: number;
    createdDate?: Date;
    modifiedBy?: number;
    modifiedDate?: Date;
    isNew: boolean = false;
    isActive?: boolean;
    showActive: boolean = false;
    injector: any;

    //constructor(private policyService: PolicyService) {}

    constructor(test?: AdditionalNamedInsured) {
      this.policyId = test?.policyId ?? 0;
      this.endorsementNo = test?.endorsementNo ?? 0;
      this.sequenceNo = test?.sequenceNo ?? 0;
      this.role = test?.role;
      this.name = test?.name ?? "";
      this.createdDate = test?.createdDate ?? new Date();
    }

    get key1() { return this.policyId };
    set key1(value: number) { this.policyId = value};

    get key2() { return this.endorsementNo };
    set key2(value: number) { this.endorsementNo = value};

    async save(): Promise<boolean> {
      console.log("coverageANI Save!");
      console.log(this);
     // const policyService = this.injector.get(PolicyService);

      if (this.isNew) {
        // const results$ = this.getEndorsementStatus(this._status.policyId, this._status.endorsementNumber);
        // await lastValueFrom(results$);

        // const results$ = this.policyService.addAdditionalNamedInsured(this);
        // await lastValueFrom(results$).then(result => {

        //   this.isNew = false;
        // });
      }
      else {
        // const results$ = this.policyService.updateAdditionalNamedInsured(this);
        // await lastValueFrom(results$).then(result => {

        //   this.isNew = false;
        // });
      }
      return true;
    }

    delete(): void {
        throw new Error("Method not implemented.");
    }
   
  }
  
  export class insuredANI implements AdditionalNamedInsured{
    policyId: number = 0;
    additionalInsuredCode: number = 0;
    insuredCode: number = 0;
    endorsementNo: number = 0;
    sequenceNo: number = 0;
    role?: number | undefined;
    name: string = "";
    createdBy?: number;
    createdDate?: Date;
    modifiedBy?: number;
    modifiedDate?: Date;
    isNew: boolean = false;
    isActive?: boolean = false;
    showActive: boolean = true;

    constructor(test?: AdditionalNamedInsured) {
      this.policyId = test?.policyId ?? 0;
      this.endorsementNo = test?.endorsementNo ?? 0;
      this.sequenceNo = test?.sequenceNo ?? 0;
      this.role = test?.role;
      this.name = test?.name ?? "";
      this.isActive = test?.isActive ?? false;
      this.createdDate = test?.createdDate ?? new Date();
    }

    
    get key1() { return this.additionalInsuredCode };
    set key1(value: number) { this.additionalInsuredCode = value};

    get key2() { return this.insuredCode };
    set key2(value: number) { this.insuredCode = value};

    async save(): Promise<boolean> {
      console.log("Insured Save!");
      console.log(this);
      return true;
    }

    delete(): void {
        throw new Error("Method not implemented.");
    }
   
  }
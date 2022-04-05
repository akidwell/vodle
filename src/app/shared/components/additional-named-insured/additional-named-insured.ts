
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
    isNew: boolean;
    get id() : number;
    save() : void;
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
    isNew: boolean = true;
    
    constructor() {
      
    }
    get id() { return this.policyId };

    save(): void {
      console.log("coverageANI Save!");
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
    isActive: boolean = true;
    isNew: boolean = true;
    
    get id() { return this.additionalInsuredCode };

    save(): void {
      console.log("Insured Save!");
    }
    delete(): void {
        throw new Error("Method not implemented.");
    }
   
  }
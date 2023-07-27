import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { ChildBaseClass } from './base/child-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { ReinsuranceLayerData } from '../../policy/models/policy';

export class ReinsuranceClass extends ChildBaseClass implements Deletable, ReinsuranceLayerData {

    policyId!: number;
    endorsementNumber!: number;
    policyLayerNo!: number;
    reinsLayerNo!: number;
    reinsLimit: number | null = null;
    reinsCededPremium: number | null = null;
    reinsCededCommRate: number = 0;
    treatyType: string | null = null;
    treatyNo?: number | null | undefined = undefined;
    subTreatyNo: number | null = null;
    reinsurerCode: number | null = null;
    reinsCertificateNo?: string | null | undefined = null;
    proflag: number | null = null;
    enteredDate: Date | null = null;
    invoiceNo: number | null = null;
    payableNo: number | null = null;
    intermediaryNo: number | null = null;
    facBalance: number | null = null;
    cededPremium: number | undefined = 0;
    cededCommission: number | null = null;
    sumIuscededPrmByTreatyInv: number | null = null;
    sumProcededPrmByTreatyInv: number | null = null;
    expirationDate: Date | null = null;
    cededCommissionRat: number | null = null;
    effectiveDate: Date | null = null;
    isFacultative: boolean | null = false;
    maxLayerLimit?: number | null | undefined = undefined;
    attachmentPoint: number = 0;

    constructor(policyId: number, endorsementNumber: number, policyLayerNo: number, reinsLayerNo: number) {
        super()
        this.policyId = policyId;
        this.endorsementNumber = endorsementNumber;
        this.policyLayerNo = policyLayerNo;
        this.reinsLayerNo = reinsLayerNo;
    }

    private _markForDeletion = false;
    get markForDeletion() : boolean {
        return this._markForDeletion;
    }
    set markForDeletion(value: boolean) {
        this._markForDeletion = value;
        this.markDirty();
    }
    
    onDelete(): void {
        throw new Error('Method not implemented.');
    }

    validateObject(): ErrorMessage[] {
        this.errorMessagesList = [];
        if (this.canEdit) {
            if (this.reinsLimit == null) {
                this.createErrorMessage(`Reinsurance Layer ${this.reinsLayerNo}: Limit cannot be empty.`);
            }
            if (this.reinsCededPremium == null) {
                this.createErrorMessage(`Reinsurance Layer ${this.reinsLayerNo}: Premium cannot be empty.`);
            }
            if (this.reinsCededCommRate == null) {
                this.createErrorMessage(`Reinsurance Layer ${this.reinsLayerNo}: Commission rate cannot be empty.`);
            }
            if (this.treatyNo == null) {
                this.createErrorMessage(`Reinsurance Layer ${this.reinsLayerNo}: Code cannot be empty.`);
            }
        }
        return this.errorMessagesList;
    }

    onGuidNewMatch(T: ChildBaseClass): void {
        this.isNew = false;
    }

    onGuidUpdateMatch(T: ChildBaseClass): void {
        this.isNew = false;
    }
}
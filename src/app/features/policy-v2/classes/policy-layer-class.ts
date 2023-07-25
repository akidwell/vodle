import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { PolicyLayerData, ReinsuranceLayerData } from '../../policy/models/policy';
import { ChildBaseClass } from './base/child-base-class';
import { ReinsuranceClass } from './reinsurance-class';

export class PolicyLayerClass extends ChildBaseClass implements PolicyLayerData {
    
    policyId: number;
    endorsementNo: number;
    policyLayerNo: number;
    policyLayerAttachmentPoint: number = 0;
    invoiceNo: number | null = null;
    copyEndorsementNo: number | null = null;
    endType: number | null = null;
    transCode: number | null = null;
    transEffectiveDate: Date | null = null;
    transExpirationDate: Date | null = null;
    isNew: boolean = true;
    reinsuranceLayers: ReinsuranceClass[] = [];

    constructor(policyId: number, endorsementNumber: number, policyLayerNo: number) {
        super()
        this.policyId = policyId;
        this.endorsementNo = endorsementNumber;
        this.policyLayerNo = policyLayerNo;
    }

    get reinsuranceData(): ReinsuranceLayerData[] {
        return this.reinsuranceLayers;
    }

    get policyLayerLimit(): number {
        return this.reinsuranceLayers
            .map(r => r.reinsLimit || 0)
            .reduce((sum, summand) => sum + summand, 0);
    }

    get policyLayerPremium(): number {
        return this.reinsuranceLayers
            .map(r => r.reinsCededPremium || 0)
            .reduce((sum, summand) => sum + summand, 0);
    }

    validateObject(): ErrorMessage[] {
        return this.reinsuranceLayers
            .map(l => l.validateObject())
            .reduce((allErrors, errors) => allErrors.concat(errors), [])
    }

    onGuidNewMatch(T: ChildBaseClass): void {
        this.isNew = false;
    }

    onGuidUpdateMatch(T: ChildBaseClass): void {
        this.isNew = false;
    }

    /**
     * Deletes a reinsurance layer from this policy layer.
     * Warning! Deleting the last reinsurance layer deletes the policy layer!
     * After calling this method, check if there are any remaining reinsurance layers and if so,
     * this policy layer must be deleted from its containing Ensorsement.
     * @param reinsurance The layer object to delete.
     */
    deleteReinsuranceLayer(reinsurance: ReinsuranceClass) {
        let index = this.reinsuranceLayers.indexOf(reinsurance);
        if (index >= 0) {
            reinsurance.markForDeletion = true;
            this.reinsuranceLayers.splice(index, 1)
            // Update reinsurnace array and RLNs
            this.reinsuranceLayers.forEach((reinsurance, index) => (reinsurance.reinsLayerNo = index + 1))
        }
    }
}
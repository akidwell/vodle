import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { ChildBaseClass } from './base/child-base-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { ActivatedRoute } from '@angular/router';
import { ReinsuranceLayerData } from '../../policy/models/policy';
import { PolicyLayerComponent } from '../components/reinsurance/policy-layer/policy-layer.component';

export class ReinsuranceClass extends ChildBaseClass implements Deletable {
    
    private data!: ReinsuranceLayerData;

    constructor(layerData: ReinsuranceLayerData) {
        super()
        this.data = layerData;
    }

    /**
     * Reinsurance data defered to inner `data` object.
     */
    get reinsLayerNo(): number { return this.data.reinsLayerNo; }
    set reinsLayerNo(value: number) {
        this.data.reinsLayerNo = value;
    }
    get attachmentPoint(): number {
        return this.data.attachmentPoint;
    }
    set attachmentPoint(value: number) {
        this.data.attachmentPoint = value;
    }
    get reinsLimit(): number | null {
        return this.data.reinsLimit;
    }
    set reinsLimit(value: number | null) {
        this.data.reinsLimit = value;
    }
    get reinsCededPremium(): number | null {
        return this.data.reinsCededPremium;
    }
    set reinsCededPremium(value: number | null) {
        this.data.reinsCededPremium = value;
    }
    get reinsCededCommRate(): number {
        return this.data.reinsCededCommRate;
    }
    set reinsCededCommRate(value: number) {
        this.data.reinsCededCommRate = value;
    }
    get treatyNo(): number | null | undefined {
        return this.data.treatyNo;
    }
    set treatyNo(value: number | null | undefined) {
        this.data.treatyNo = value;
    }
    get isFacultative(): boolean | null {
        return this.data.isFaculative;
    }
    set isFacultative(value: boolean | null) {
        this.data.isFaculative = value;
    }
    get intermediaryNo(): number | null {
        return this.data.intermediaryNo;
    }
    set intermediaryNo(value: number | null) {
        this.data.intermediaryNo = value;
    }
    get reinsCertificateNo(): string | null | undefined {
        return this.data.reinsCertificateNo;
    }
    set reinsCertificateNo(value: string | null | undefined) {
        this.data.reinsCertificateNo = value;
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
        throw new Error('Method not implemented.');
    }
    onGuidNewMatch(T: ChildBaseClass): void {
        throw new Error('Method not implemented.');
    }
    onGuidUpdateMatch(T: ChildBaseClass): void {
        throw new Error('Method not implemented.');
    }
}
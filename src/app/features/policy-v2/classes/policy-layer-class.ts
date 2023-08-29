import { ErrorMessage } from 'src/app/shared/interfaces/errorMessage';
import { PolicyLayerData, ReinsuranceLayerData } from '../../policy/models/policy';
import { ChildBaseClass } from './base/child-base-class';
import { ReinsuranceClass } from './reinsurance-class';
import { Deletable } from 'src/app/shared/interfaces/deletable';
import { ParentBaseClass } from './base/parent-base-class';

export class PolicyLayerClass extends ParentBaseClass implements PolicyLayerData, Deletable {
  onChildDeletion(child: Deletable): void {
      throw new Error('Method not implemented.');
  }

  policyId: number = -1;
  endorsementNo: number = -1;
  policyLayerAttachmentPoint: number = 0;
  invoiceNo: number | null = null;
  copyEndorsementNo: number | null = null;
  endType: number | null = null;
  transCode: number | null = null;
  transEffectiveDate: Date | null = null;
  transExpirationDate: Date | null = null;
  isNew: boolean = true;
  reinsuranceLayers: ReinsuranceClass[] = [];

  constructor(policy?: PolicyLayerData) {
    super();
    if (policy) {
      this.existingInit(policy);
    } else {
      this.newInit();
    }
  }

  existingInit(policyData: PolicyLayerData) {
    this.policyId = policyData.policyId;
    this.endorsementNo = policyData.endorsementNo;
    this.policyLayerNo = policyData.policyLayerNo;
    this.policyLayerAttachmentPoint = policyData.policyLayerAttachmentPoint;
    this.invoiceNo = policyData.invoiceNo;
    this.copyEndorsementNo = policyData.copyEndorsementNo;
    this.endType = policyData.endType;
    this.transCode = policyData.transCode;
    this.transEffectiveDate = policyData.transEffectiveDate;
    this.transExpirationDate = policyData.transExpirationDate;
    this.isNew = policyData.isNew;
    this.reinsuranceLayers = policyData.reinsuranceData.map(r => new ReinsuranceClass(this, r));
  }

  newInit() {

  }

  static create(policyId: number, endorsementNumber: number, policyLayerNo: number): PolicyLayerClass {
    const layer = new PolicyLayerClass();
    layer.policyId = policyId;
    layer.endorsementNo = endorsementNumber;
    layer.policyLayerNo = policyLayerNo;
    layer.markDirty();
    return layer;
  }

  private _policyLayerNo = -1;
  get policyLayerNo(): number {
    return this._policyLayerNo;
  }
  set policyLayerNo(value: number) {
    this._policyLayerNo = value;
    this.markDirty();
  }

  private _markForDeletion = false;
  get markForDeletion() : boolean {
    return this._markForDeletion;
  }
  set markForDeletion(value: boolean) {
    this._markForDeletion = value;
    this.markDirty();
    this.reinsuranceLayers.forEach(r => r.markForDeletion = value);
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
    this.errorMessagesList = this.validateChildren(this);
    if (this.reinsuranceLayers.length < 1) {
      this.createErrorMessage(`Policy Layer ${this.policyLayerNo} must have at least one reinsurance layer.`)
    }
    // Collect child error messages into one array
    this.reinsuranceLayers
      .map(l => l.validateObject())
      .reduce((allErrors, errors) => allErrors.concat(errors), [])
    // Prepend policy layer # to messages
      .forEach(m => this.createErrorMessage(`Policy Layer ${this.policyLayerNo} - ${m.message}`));
    return this.errorMessagesList;
  }

  onDelete(): void {
    throw new Error('Method not implemented.');
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
    const index = this.reinsuranceLayers.indexOf(reinsurance);
    if (index >= 0) {
      reinsurance.markForDeletion = true;
      this.reinsuranceLayers.splice(index, 1);
      // Update reinsurnace array and RLNs
      this.reinsuranceLayers.forEach((reinsurance, index) => (reinsurance.reinsLayerNo = index + 1));
    }
  }

  toJSON(): PolicyLayerData {
    return {
      policyId: this.policyId,
      endorsementNo: this.endorsementNo,
      policyLayerNo: this.policyLayerNo,
      policyLayerAttachmentPoint: this.policyLayerAttachmentPoint,
      policyLayerLimit: this.policyLayerLimit,
      policyLayerPremium: this.policyLayerPremium,
      invoiceNo: this.invoiceNo,
      copyEndorsementNo: this.copyEndorsementNo,
      endType: this.endType,
      transCode: this.transCode,
      transEffectiveDate: this.transEffectiveDate,
      transExpirationDate: this.transExpirationDate,
      isNew: this.isNew,
      markForDeletion: this.markForDeletion,
      isDirty: this.isDirty,
      reinsuranceData: this.reinsuranceLayers.map(r => r.toJSON())
    };
  }
}

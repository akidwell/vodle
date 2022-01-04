import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { NotificationService } from 'src/app/notification/notification-service';
import { Endorsement, newReinsuranceLayer,  PolicyLayerData, ReinsuranceLayerData } from '../../policy';
import { EndorsementStatusService } from '../../services/endorsement-status.service';
import { ReinsuranceLayerComponent } from './reinsurance-layer/reinsurance-layer.component';

@Component({
  selector: 'rsps-policy-layer-group',
  templateUrl: './policy-layer-group.component.html',
  styleUrls: ['./policy-layer-group.component.css']
})
export class PolicyLayerGroupComponent implements OnInit {
  endorsement!: Endorsement;
  isReadOnly: boolean = true;
  canEditPolicy: boolean = false;
  authSub: Subscription;
  canEditTransactionType: boolean = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  policyLayerCollapsed = false;
  policyLayer!: PolicyLayerData[];
  newReinsuranceLayer!: ReinsuranceLayerData;
  endorsementNumber!: number;
  policyId!: number;
  policyLayerNo!: number;
  reinsuranceLayerNo!: number;
  faTrashcan = faTrashAlt;
  updateSub!: Subscription;
  newPolicyLayer!: PolicyLayerData;
  newReinsurance!: ReinsuranceLayerData;
  statusSub!: Subscription;
  canEditEndorsement: boolean = false;

  @Input() index!: number;
  @Input() policyLayerData!: PolicyLayerData;
  @Output() existingPl: EventEmitter<number> = new EventEmitter();
  @ViewChild(ReinsuranceLayerComponent) reinsComp!: ReinsuranceLayerComponent;
  @ViewChildren(ReinsuranceLayerComponent) components!: QueryList<ReinsuranceLayerComponent>;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private notification: NotificationService, private endorsementStatusService: EndorsementStatusService){
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsement = data['endorsementData'].endorsement;
      this.policyLayer = data['policyLayerData'].policyLayer;
      this.canEditTransactionType = Number(this.route.snapshot.paramMap.get('end') ?? 0) > 0;
      this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
      this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
  }

  deleteExistingReinsuranceLayer(existingReinsuranceLayer: ReinsuranceLayerData) {
    const reinsuranceindex = this.policyLayerData.reinsuranceData.indexOf(existingReinsuranceLayer, 0);
    if (reinsuranceindex > 0 || (reinsuranceindex == 0 && this.policyLayerData.reinsuranceData.length > 0)) {
      this.policyLayerData.reinsuranceData.splice(reinsuranceindex, 1);
      this.policyLayer.forEach(x=> x.reinsuranceData.forEach((value, index)=>{  value.reinsLayerNo = index + 1}));
      if (!existingReinsuranceLayer.isNew) {
        this.notification.show('Reinsurance Layer deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
    if (reinsuranceindex == 0 && this.policyLayerData.reinsuranceData.length < 1){
      const polLayerNo = existingReinsuranceLayer.policyLayerNo
      const existingPolicyLayer = this.policyLayer.findIndex(i=> i.policyLayerNo == polLayerNo)
      this.deleteExistingPolicyLayer(existingPolicyLayer)
    }
  }

  deleteExistingPolicyLayer(existingPolicyLayer: number){
    this.policyLayer.splice(existingPolicyLayer, 1);
    this.policyLayer.forEach((value, index) =>{  value.policyLayerNo = index + 1 });
    this.policyLayer.forEach(x=> x.reinsuranceData.forEach((value)=>{  value.policyLayerNo = x.policyLayerNo}));
    this.notification.show('Policy and Reinsurance Layers deleted.', { classname: 'bg-success text-light', delay: 5000 });
  }

  isValid(): boolean {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.reinsuranceForm.status != 'VALID') {
          return false;
        }
      }
    }
    return true;
  }

  isDirty() {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.reinsuranceForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }

  async savePolicyLayers(): Promise<boolean> {
    if (this.canEditPolicy) {
      let saveCount: number = 0;
      let result = await this.reinsComp.save(this.policyLayer);
      if (result === false) {
        this.notification.show('Reinsurance Layer ' + this.reinsComp.reinsuranceLayer.reinsLayerNo.toString() + ' not saved.', { classname: 'bg-danger text-light', delay: 5000 });
      }
      else {
        this.markPristine();
        saveCount++
      }
      if (saveCount > 0) {
        this.notification.show('Reinsurance Layers successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
      }
      if (!this.isValid()) {
        this.notification.show('Reinsurance Layers not saved.', { classname: 'bg-danger text-light', delay: 5000 });
        return false;
      }
    }
    return false;
  }

  private markPristine(): void {
    this.components.forEach(c => c.reinsuranceForm.form.markAsPristine());
    this.policyLayer.forEach(c => c.isNew = false);
    this.policyLayer.forEach(c => c.reinsuranceData.forEach(x => x.isNew = false));
  }

  calcTotalPolicyLayerLimit(): number {
    let total: number = 0;
    this.policyLayerData.reinsuranceData.forEach(layer => total += layer.reinsLimit ?? 0);
    return total;
  }

  calcTotalPolicyLayerPremium(): number {
    let total: number = 0;
    this.policyLayerData.reinsuranceData.forEach(layer => total += layer.reinsCededPremium ?? 0);
    return total;
  }

  addNewReinsuranceLayer(): void {
    this.existingPl.emit(this.policyLayerData.policyLayerNo)
    this.reinsuranceLayerNo = this.getNextReinsuranceLayerSequence();
    this.newReinsuranceLayer = newReinsuranceLayer(this.policyId, this.endorsementNumber, this.policyLayerData.policyLayerNo, this.reinsuranceLayerNo);
    this.policyLayerData.reinsuranceData.push(this.newReinsuranceLayer)
  }

  addNewPolicyLayer(): void {
    this.newPolicyLayer = this.createNewPolicyLayer();
    this.newReinsurance = newReinsuranceLayer(this.policyId, this.endorsementNumber, this.policyLayerNo, 1);
    this.newPolicyLayer.reinsuranceData.push(this.newReinsurance)
    this.policyLayer.push(this.newPolicyLayer);
  }

  createNewPolicyLayer(): PolicyLayerData {
    return {
      policyId: this.policyId,
      endorsementNo: this.endorsementNumber,
      policyLayerNo: this.getNextPolicyLayerSequence(),
      policyLayerAttachmentPoint: undefined,
      policyLayerLimit: undefined,
      policyLayerPremium: undefined,
      invoiceNo: null,
      copyEndorsementNo: null,
      endType: null,
      transCode: null,
      transEffectiveDate: null,
      transExpirationDate: null,
      reinsuranceData: [],
      isNew: true
    }
  }
  
  getNextReinsuranceLayerSequence(): number {
    if (this.policyLayerData.reinsuranceData.length == 0) {
      this.reinsuranceLayerNo = 1
      return this.reinsuranceLayerNo;
    }
    else {
      this.reinsuranceLayerNo = Math.max(...this.policyLayerData.reinsuranceData.map(o => o.reinsLayerNo)) + 1;
      return this.reinsuranceLayerNo;
    }
  }

  getNextPolicyLayerSequence(): number {
    if (this.policyLayer.length == 0) {
      this.policyLayerNo = 1
      return this.policyLayerNo;
    }
    else {
      this.policyLayerNo = Math.max(...this.policyLayer.map(o => o.policyLayerNo)) + 1;
      return this.policyLayerNo;
    }
  }
}

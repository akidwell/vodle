import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { NotificationService } from 'src/app/notification/notification-service';
import { Endorsement, newReinsuranceLayer, PolicyLayerData, ReinsuranceLayerData } from '../../policy';
import { PolicyService } from '../../policy.service';
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

  @Input() index!: number;
  @Input() policyLayerData!: PolicyLayerData;
  @Output() existingPl: EventEmitter<number> = new EventEmitter();
  @ViewChild(ReinsuranceLayerComponent) reinsComp!: ReinsuranceLayerComponent;
  @ViewChildren(ReinsuranceLayerComponent) components: QueryList<ReinsuranceLayerComponent> | undefined;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private datePipe: DatePipe, private notification: NotificationService, private policyService: PolicyService) {
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
  }

  deleteExistingReinsuranceLayer(existingReinsuranceLayer: ReinsuranceLayerData) {
    const reinsuranceindex = this.policyLayerData.reinsuranceData.indexOf(existingReinsuranceLayer, 0);
    if (reinsuranceindex > 0 || (reinsuranceindex == 0 && this.policyLayerData.reinsuranceData.length > 0)) {
      this.policyLayerData.reinsuranceData.splice(reinsuranceindex, 1);
      this.policyLayer.forEach(x=> x.reinsuranceData.forEach((value, index)=>{  value.reinsLayerNo = index + 1}));
      window.location.reload
      this.notification.show('Reinsurance Layer deleted.', { classname: 'bg-success text-light', delay: 5000 });
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
    window.location.reload
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

    if (this.canEditPolicy && this.isDirty() ) {
      let saveCount: number = 0;
      if (this.components != null) {
        for (let child of this.components) {
          if (child.reinsuranceForm.dirty) {         
            let result = await child.save(this.policyLayer);
            if (result === false) {
              this.notification.show('Reinsurance Layer ' + child.reinsuranceLayer.reinsLayerNo.toString() + ' not saved.', { classname: 'bg-danger text-light', delay: 5000 });
            }
            else {
              saveCount++;
            }
          }
        }
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

  calcTotalPolicyLayerLimit(): number {
    let total: number = 0;
    this.policyLayerData.reinsuranceData.forEach(layer => total += layer.reinsLimit ?? 0);
    return total;
  }

  calcTotalPolicyLayerPremium(): number {
    let total: number = 0;
    this.policyLayerData.reinsuranceData.forEach(layer => total += layer.cededPremium ?? 0);
    return total;
  }

  addNewReinsuranceLayer(): void {
    this.existingPl.emit(this.policyLayerData.policyLayerNo)
    this.reinsuranceLayerNo = this.getNextReinsuranceLayerSequence();
    this.newReinsuranceLayer = newReinsuranceLayer(this.policyId, this.endorsementNumber, this.policyLayerData.policyLayerNo, this.reinsuranceLayerNo);
    this.newReinsuranceLayer.treatyNo = this.reinsComp.treatyNo
    this.newReinsuranceLayer.reinsCededCommRate = this.reinsComp.commRate
    //this.reinsComp.reinsuranceForm.form.markAsDirty();
    this.policyLayerData.reinsuranceData.push(this.newReinsuranceLayer)
  }

  addNewPolicyLayer(): void {
    this.newPolicyLayer = this.createNewPolicyLayer();
    this.newReinsurance = newReinsuranceLayer(this.policyId, this.endorsementNumber, this.policyLayerNo, 1);
    this.newReinsurance.treatyNo = this.reinsComp.treatyNo
    this.newReinsurance.reinsCededCommRate = this.reinsComp.commRate
    this.newPolicyLayer.reinsuranceData.push(this.newReinsurance)
    this.policyLayer.push(this.newPolicyLayer);
    this.reinsComp.reinsuranceForm.form.markAsDirty();
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
      console.log(this.policyLayerData.reinsuranceData)
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

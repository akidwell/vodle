import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { NotificationService } from 'src/app/notification/notification-service';
import { Endorsement, PolicyLayerData, ReinsuranceLayerData } from '../../policy';
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
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  policyLayerCollapsed = false;
  policyLayer!: PolicyLayerData[];
  endorsementNumber!: number;
  policyId!: number;
  faTrashcan = faTrashAlt;
  updateSub!: Subscription;
  statusSub!: Subscription;
  canEditEndorsement: boolean = false;

  @Input() index!: number;
  @Input() policyLayerData!: PolicyLayerData;
  @Output() addReinsurance: EventEmitter<PolicyLayerData> = new EventEmitter();
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
        this.endorsementStatusService.reinsuranceValidated = false;
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
    if (!this.policyLayer[existingPolicyLayer].isNew) {
      this.endorsementStatusService.reinsuranceValidated = false;
      this.notification.show('Policy and Reinsurance Layers deleted.', { classname: 'bg-success text-light', delay: 5000 });
    }
    this.policyLayer.splice(existingPolicyLayer, 1);
    this.policyLayer.forEach((value, index) =>{  value.policyLayerNo = index + 1 });
    this.policyLayer.forEach(x=> x.reinsuranceData.forEach((value)=>{  value.policyLayerNo = x.policyLayerNo}));
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
    this.policyLayerData.reinsuranceData.forEach(
      layer => total += Number.isNaN(Number(layer.reinsLimit)) ? 0 : Number(layer.reinsLimit)
    );
    return total;
  }

  calcTotalPolicyLayerPremium(): number {
    let total: number = 0;
    this.policyLayerData.reinsuranceData.forEach(
      layer => total += Number.isNaN(Number(layer.reinsCededPremium)) ? 0 : Number(layer.reinsCededPremium)
    );
    return total;
  }

  addNewReinsuranceLayer(): void {
    this.addReinsurance.emit(this.policyLayerData)
  }
}

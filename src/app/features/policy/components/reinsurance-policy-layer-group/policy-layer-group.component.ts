import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { Endorsement, PolicyLayerData, ReinsuranceLayerData } from '../../models/policy';
import { EndorsementStatusService } from '../../services/endorsement-status/endorsement-status.service';
import { ReinsuranceLayerComponent } from '../reinsurance-layer/reinsurance-layer.component';

@Component({
  selector: 'rsps-policy-layer-group',
  templateUrl: './policy-layer-group.component.html',
  styleUrls: ['./policy-layer-group.component.css']
})
export class PolicyLayerGroupComponent implements OnInit {
  endorsement!: Endorsement;
  isReadOnly = true;
  canEditPolicy = false;
  authSub: Subscription;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  policyLayerCollapsed = false;
  policyLayers!: PolicyLayerData[];
  endorsementNumber!: number;
  policyId!: number;
  faTrashcan = faTrashAlt;
  updateSub!: Subscription;
  statusSub!: Subscription;
  canEditEndorsement = false;

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
      this.policyLayers = data['policyLayerData'].policyLayer;
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
    this.authSub?.unsubscribe();
    this.statusSub?.unsubscribe();
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy;
  }

  deleteExistingReinsuranceLayer(existingReinsuranceLayer: ReinsuranceLayerData) {
    const reinsuranceindex = this.policyLayerData.reinsuranceData.indexOf(existingReinsuranceLayer, 0);
    if (reinsuranceindex > 0 || (reinsuranceindex == 0 && this.policyLayerData.reinsuranceData.length > 0)) {
      this.policyLayerData.reinsuranceData.splice(reinsuranceindex, 1);
      this.policyLayers.forEach(x=> x.reinsuranceData.forEach((value, index)=>{ value.reinsLayerNo = index + 1;}));
      if (!existingReinsuranceLayer.isNew) {
        this.endorsementStatusService.reinsuranceValidated = false;
        this.notification.show('Reinsurance Layer deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
    if (reinsuranceindex == 0 && this.policyLayerData.reinsuranceData.length < 1){
      const polLayerNo = existingReinsuranceLayer.policyLayerNo;
      const existingPolicyLayer = this.policyLayers.findIndex(i=> i.policyLayerNo == polLayerNo);
      this.deleteExistingPolicyLayer(existingPolicyLayer);
    }
  }

  deleteExistingPolicyLayer(existingPolicyLayer: number){
    if (!this.policyLayers[existingPolicyLayer].isNew) {
      this.endorsementStatusService.reinsuranceValidated = false;
      this.notification.show('Policy and Reinsurance Layers deleted.', { classname: 'bg-success text-light', delay: 5000 });
    }
    this.policyLayers.splice(existingPolicyLayer, 1);
    this.policyLayers.forEach((value, index) =>{ value.policyLayerNo = index + 1; });
    this.policyLayers.forEach(x=> x.reinsuranceData.forEach((value)=>{ value.policyLayerNo = x.policyLayerNo;}));
  }

  isValid(): boolean {
    if (this.components != null) {
      for (const child of this.components) {
        if (child.reinsuranceForm.status != 'VALID') {
          return false;
        }
      }
    }
    return true;
  }

  isDirty() {
    if (this.components != null) {
      for (const child of this.components) {
        if (child.reinsuranceForm.dirty) {
          return true;
        }
      }
    }
    return false;
  }

  async savePolicyLayers(): Promise<boolean> {
    if (this.canEditPolicy) {
      let saveCount = 0;
      const result = await this.reinsComp.save(this.policyLayers);
      if (result === false) {
        this.notification.show('Reinsurance Layer ' + this.reinsComp.reinsuranceLayer.reinsLayerNo.toString() + ' not saved.', { classname: 'bg-danger text-light', delay: 5000 });
      }
      else {
        this.markPristine();
        saveCount++;
      }
      if (saveCount > 0) {
        this.notification.show('Reinsurance Layers successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        return true;
      }
      if (!this.isValid()) {
        this.notification.show('Reinsurance Layers not saved.', { classname: 'bg-danger text-light', delay: 5000 });
        return false;
      }
    }
    return false;
  }

  public markPristine(): void {
    this.components.forEach(c =>{ c.reinsuranceForm.form.markAsPristine(); c.reinsuranceForm.form.markAsUntouched();});
  }

  calcTotalPolicyLayerLimit(): number {
    let total = 0;
    this.policyLayerData.reinsuranceData.forEach(
      layer => total += Number.isNaN(Number(layer.reinsLimit)) ? 0 : Number(layer.reinsLimit)
    );
    return total;
  }

  calcTotalPolicyLayerPremium(): number {
    let total = 0;
    this.policyLayerData.reinsuranceData.forEach(
      layer => total += Number.isNaN(Number(layer.reinsCededPremium)) ? 0 : Number(layer.reinsCededPremium)
    );
    return total;
  }

  addNewReinsuranceLayer(): void {
    this.addReinsurance.emit(this.policyLayerData);
    this.policyLayerCollapsed = false;
  }
}

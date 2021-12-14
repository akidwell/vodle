import { Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { newReinsuranceLayer, PolicyLayerData, ReinsuranceLayerData } from '../policy';
import { PolicyStatusService } from '../services/policy-status.service';
import { PolicyLayerGroupComponent } from './policy-layer-group/policy-layer-group.component';
import { ReinsuranceLayerComponent } from './policy-layer-group/reinsurance-layer/reinsurance-layer.component';
import { PolicyLayerHeaderComponent } from './policy-layer-header/policy-layer-header.component';

@Component({
  selector: 'rsps-reinsurance',
  templateUrl: './reinsurance.component.html',
  styleUrls: ['./reinsurance.component.css']
})
export class ReinsuranceComponent implements OnInit {

  policyLayerData!: PolicyLayerData[];
  canEditPolicy: boolean = false;
  authSub: Subscription;
  canEditTransactionType: boolean = false;
  updateSub!: Subscription;
  policyLayer!: PolicyLayerData[];
  endorsementNumber!: number;
  policyId!: number;
  newPolicyLayer!: PolicyLayerData;
  newReinsurance!: ReinsuranceLayerData;
  showInvalid: boolean = false;
  invalidMessage: string = "";


  @Output() addNewPolicyLayers: EventEmitter<string> = new EventEmitter();
  @ViewChild(PolicyLayerGroupComponent) policyLayerGroup!: PolicyLayerGroupComponent;
  @ViewChild(ReinsuranceLayerComponent) reinsLayerComp!: ReinsuranceLayerComponent;
  @ViewChild(PolicyLayerHeaderComponent) headerComp!: PolicyLayerHeaderComponent;
  @ViewChildren(PolicyLayerGroupComponent) components: QueryList<PolicyLayerGroupComponent> | undefined;


  constructor(private route: ActivatedRoute, private userAuth: UserAuth,private policyStatusService: PolicyStatusService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyLayerData = data['policyLayerData'].policyLayer;
      console.log(this.policyLayerData)
      this.canEditTransactionType = Number(this.route.snapshot.paramMap.get('end') ?? 0) > 0;
      this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
      this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
    });
  }

  async addPolicyLayer() {
    if (this.policyLayerData.length > 0) {
      this.addNewPolicyLayers.emit();
      this.policyLayerGroup.addNewPolicyLayer()
    }
    else {
      this.addNewPolicyLayer();
    }
  }

  addNewPolicyLayer(): void {
    this.newPolicyLayer = this.createNewPolicyLayer();
    this.newReinsurance = newReinsuranceLayer(this.policyId, this.endorsementNumber, 1, 1);
    this.newPolicyLayer.reinsuranceData.push(this.newReinsurance)
    this.policyLayerData.push(this.newPolicyLayer);
  }

  createNewPolicyLayer(): PolicyLayerData {
    return {
      policyId: this.policyId,
      endorsementNo: this.endorsementNumber,
      policyLayerNo: 1,
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

  save(): void {
    if (this.isDirty() && this.isValid())
      this.policyLayerGroup.savePolicyLayers();
  }

  isValid(): boolean {
    let total: number = 0;
    this.policyLayerData.forEach(group => { group.reinsuranceData.forEach(layer => { total += layer.reinsCededPremium?.toString() == "" ? 0 : layer.reinsCededPremium ?? 0 }) });
    if (this.components != null) {
      for (let child of this.components) {
        if (!child.isValid()) {
          this.policyStatusService.reinsuranceValidated = false;
          return false;
        }
      }
    }
    this.policyStatusService.reinsuranceValidated = this.headerComp.endorsement.premium == total;
    return this.headerComp.endorsement.premium == total;
  }
  isDirty(): boolean {
    if (this.components != null) {
      for (let child of this.components) {
        if (child.isDirty()) {
          return true;
        }
      }
    }
    return false;
  }

  showInvalidControls(): void {
    let invalid = [];

    // Loop through each child component to see it any of them have invalid controls
    if (this.components != null) {
      for (let child of this.components) {
        for (let name in child.reinsComp.reinsuranceForm.controls) {
          if (child.reinsComp.reinsuranceForm.controls[name].invalid) {
            invalid.push(name + " - Policy Layer: # " + child.reinsComp.reinsuranceLayer.policyLayerNo + " is Invalid");
          }
        }
      }
    }

    // Compile all invalide controls in a list
    if (invalid.length > 0) {
      this.showInvalid = true;
      for (let error of invalid) {
        this.invalidMessage += "<br><li>" + error;
      }
    }
    if (!this.checkPremiumMatches()) {
      this.showInvalid = true;
      this.invalidMessage += "<br><li>Premium totals do not match";
    }

    if (this.showInvalid) {
      this.invalidMessage = "Following fields are invalid" + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }
  checkPremiumMatches(): boolean {
    let total: number = 0;
    this.policyLayerData.forEach(group => { group.reinsuranceData.forEach(layer => { total += layer.reinsCededPremium?.toString() == "" ? 0 : layer.reinsCededPremium ?? 0 }) });
    return this.headerComp.endorsement.premium == total
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }
}
import { Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { newReinsuranceLayer, PolicyInformation, PolicyLayerData, ReinsuranceLayerData } from '../policy';
import { EndorsementStatusService } from '../services/endorsement-status.service';
import { PolicyLayerGroupComponent } from './policy-layer-group/policy-layer-group.component';
import { ReinsuranceLayerComponent } from './policy-layer-group/reinsurance-layer/reinsurance-layer.component';
import { PolicyLayerHeaderComponent } from './policy-layer-header/policy-layer-header.component';
import { ReinsuranceLookup } from './reinsurance-lookup/reinsurance-lookup';
import { ReinsuranceLookupService } from './reinsurance-lookup/reinsurance-lookup.service';

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
  statusSub!: Subscription;
  canEditEndorsement: boolean = false;
  authLoadedSub!: Subscription;
  reinsuranceSub!: Subscription;
  reinsuranceCodes$: Observable<ReinsuranceLookup[]> | undefined;
  reinsuranceCodes!: ReinsuranceLookup[];
  reinsuranceFacCodes$: Observable<ReinsuranceLookup[]> | undefined;
  reinsuranceFacCodes!: ReinsuranceLookup[];
  policyInfo!: PolicyInformation;

  
  @Output() addNewPolicyLayers: EventEmitter<string> = new EventEmitter();
  @ViewChild(PolicyLayerGroupComponent) policyLayerGroup!: PolicyLayerGroupComponent;
  @ViewChild(ReinsuranceLayerComponent) reinsLayerComp!: ReinsuranceLayerComponent;
  @ViewChild(PolicyLayerHeaderComponent) headerComp!: PolicyLayerHeaderComponent;
  @ViewChildren(PolicyLayerGroupComponent) components: QueryList<PolicyLayerGroupComponent> | undefined;

  constructor(private route: ActivatedRoute, private userAuth: UserAuth,private endorsementStatusService: EndorsementStatusService, private reinsuranceLookupService: ReinsuranceLookupService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(async data => {
      this.policyLayerData = data['policyLayerData'].policyLayer;
      this.policyInfo = data['policyInfoData'].policyInfo;

      console.log(this.policyLayerData)
      this.canEditTransactionType = Number(this.route.snapshot.paramMap.get('end') ?? 0) > 0;
      this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
      this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
      await this.populateReinsuranceCodes();
      this.populateReinsuranceFacCodes();

      // Added new policy layer or reinsurance layer if not added yet on coming in first time
      this.authLoadedSub = this.userAuth.loaded$.subscribe((loaded) => {
        if (loaded && this.canEditPolicy && this.endorsementStatusService.canEditEndorsement.value) {
          if (this.policyLayerData.length == 0) {
            this.addNewPolicyLayer();
          }
          else if (this.policyLayerData.length == 1 && this.policyLayerData[0].reinsuranceData.length == 0) {
            const newReinsurance = newReinsuranceLayer(this.policyId, this.endorsementNumber, 1, 1);
            this.policyLayerData[0].reinsuranceData.push(newReinsurance)
          }
        }
      });
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });
  }
  
  async populateReinsuranceCodes(): Promise<void> {
    await this.reinsuranceLookupService.getReinsurance(this.policyInfo.programId, this.policyInfo.policyEffectiveDate).toPromise().then(
      reisuranceCodes => {
        this.reinsuranceCodes = reisuranceCodes;
        this.reinsuranceCodes$ = of(reisuranceCodes);
      }
    );
  }

  populateReinsuranceFacCodes(): void {
    this.reinsuranceSub = this.reinsuranceLookupService.getFaculativeReinsurance(this.policyInfo.policyEffectiveDate).subscribe({
      next: reisuranceCodes => {
        this.reinsuranceFacCodes = reisuranceCodes;
        this.reinsuranceFacCodes$ = of(reisuranceCodes);
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
    this.authLoadedSub?.unsubscribe();
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
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
    if (this.canEdit)
      this.policyLayerGroup.savePolicyLayers();
  }

  isValid(): boolean {
    let totalPrem: number = 0;
    let totalLimit: number = 0;
    let subAttachmentpoints = false;

    if (this.canEdit) {
      this.policyLayerData.forEach(group => { group.reinsuranceData.forEach(layer => { totalPrem += layer.reinsCededPremium?.toString() == "" ? 0 : layer.reinsCededPremium ?? 0 }) });
      this.policyLayerData.forEach(group => { group.reinsuranceData.forEach(layer => { totalLimit += layer.reinsLimit?.toString() == "" ? 0 : layer.reinsLimit ?? 0 }) });
      subAttachmentpoints = this.checkSubAttachmentPoints()

      if (this.components != null) {
        for (let child of this.components) {
          if (!child.isValid()) {
            this.endorsementStatusService.reinsuranceValidated = false;
            return false;
          }
        }
      }
      const totalMatches =  this.headerComp.endorsement.premium == totalPrem && this.headerComp.endorsement.limit == totalLimit &&
      this.policyLayerData[0].reinsuranceData[0].attachmentPoint == this.headerComp.endorsement.attachmentPoint && subAttachmentpoints;

      this.endorsementStatusService.reinsuranceValidated = totalMatches;
      return totalMatches;
    }
    this.endorsementStatusService.reinsuranceValidated = true;
    return true;
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
    this.invalidMessage = ""
    this.showInvalid = false;

    // Loop through each child component to see it any of them have invalid controls
    for (let groups of this.components!) {
      for (let child of groups.components) {
        for (let name in child.reinsuranceForm.controls) {
          if (child.reinsuranceForm.controls[name].invalid) {
            invalid.push(name + " - Policy Layer: #" + child.policyLayerData.policyLayerNo.toString());
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

    if (!this.checkLimitMatches()) {
      this.showInvalid = true;
      this.invalidMessage += "<br><li>Limit totals do not match";
    }

    if (!this.checkAttachmentPoint()) {
      this.showInvalid = true;
      this.invalidMessage += "<br><li>Policy Layer 1 attachment point does not eqaul total Policy Attachment point";
    }

    if (!this.checkSubAttachmentPoints()) {
      this.showInvalid = true;
      this.invalidMessage += "<br><li>Please review attachment points";
    }
    if(!this.checkAgreementLimits()){
      this.showInvalid = true;
    }

    if (this.showInvalid) {
      this.invalidMessage = "Following fields are invalid" + this.invalidMessage;
    }
    else {
      this.hideInvalid();
    }
  }

  checkAttachmentPoint(): boolean {
    return (this.policyLayerData[0]?.reinsuranceData[0]?.attachmentPoint) == this.headerComp.endorsement.attachmentPoint
  }

  checkSubAttachmentPoints(): boolean {
    let total: number = this.headerComp.endorsement.attachmentPoint;
    let failed: boolean = false;

    this.policyLayerData.forEach(group => {
      group.reinsuranceData.forEach((layer) => {
        if (layer.attachmentPoint != total && layer.reinsLayerNo == 1) {
          failed = true
        } else {
          total += layer.reinsLimit?.toString() == "" ? 0 : layer.reinsLimit ?? 0
            + (layer.attachmentPoint?.toString() == "" ? 0 : layer.attachmentPoint ?? 0);
        }
      })
    });
    return !failed;
  }

  checkPremiumMatches(): boolean {
    let total: number = 0;
    this.policyLayerData.forEach(group => { group.reinsuranceData.forEach(layer => { total += layer.reinsCededPremium?.toString() == "" ? 0 : layer.reinsCededPremium ?? 0 }) });
    return this.headerComp.endorsement.premium == total
  }

  checkLimitMatches(): boolean {
    let total: number = 0;
    this.policyLayerData.forEach(group => { group.reinsuranceData.forEach(layer => { total += layer.reinsLimit?.toString() == "" ? 0 : layer.reinsLimit ?? 0 }) });
    return this.headerComp.endorsement.limit == total
  }

  checkAgreementLimits(): boolean {
    let failed: boolean = false;
    let filteredList: number | undefined = 0;
    let comboList = [];

    this.policyLayerData.forEach(group => {
      group.reinsuranceData.forEach(layer => {
        if (layer.treatyNo == 1) {
          if (layer.reinsLimit > this.headerComp.endorsement.limit) {
            this.invalidMessage += "<br><li>Policy Layer #:" + layer.policyLayerNo + ", Reinsurance Layer #:" + layer.reinsLayerNo + ". Max Layer Limit is: " + this.headerComp.endorsement.limit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            failed = true;
          }
        }
        else if (layer.treatyNo !== 1) {
          comboList = this.reinsuranceCodes.concat(this.reinsuranceFacCodes)
          filteredList = comboList.find(x => x.treatyNumber == layer.treatyNo)?.maxLayerLimit
          if (filteredList != null)
            if (layer.reinsLimit > filteredList) {
              this.invalidMessage += "<br><li>Please check Insuring Agreement for Policy Layer #:" + layer.policyLayerNo + ", Reinsurance Layer #:" + layer.reinsLayerNo + ". Max Layer Limit is: " + filteredList.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              failed = true;
            }
        }
      })

    });
    return !failed;
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }
}
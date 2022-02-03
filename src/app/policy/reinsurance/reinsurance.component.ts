import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { Endorsement, newPolicyLayer, newReinsuranceLayer, PolicyInformation, PolicyLayerData, ReinsuranceLayerData } from '../policy';
import { EndorsementStatusService } from '../services/endorsement-status.service';
import { PolicyLayerGroupComponent } from './policy-layer-group/policy-layer-group.component';
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
  updateSub!: Subscription;
  endorsementNumber!: number;
  policyId!: number;
  showInvalid: boolean = false;
  invalidMessage: string = "";
  statusSub!: Subscription;
  canEditEndorsement: boolean = false;
  authLoadedSub!: Subscription;
  reinsuranceSub!: Subscription;
  reinsuranceCodes: ReinsuranceLookup[] | null = null;
  reinsuranceFacCodes: ReinsuranceLookup[] | null = null;
  policyInfo!: PolicyInformation;
  endorsement!: Endorsement;
  reinsuranceRefreshedSub!: Subscription;
  loading: boolean = true;

  @ViewChild(PolicyLayerGroupComponent) policyLayerGroup!: PolicyLayerGroupComponent;
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
      this.endorsement = data['endorsementData'].endorsement;
      console.log(this.policyLayerData)
      this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
      this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
      await this.populateReinsuranceCodes();
      await this.populateReinsuranceFacCodes();
      // console.log("Init Load");

      // Added new policy layer or reinsurance layer if not added yet on coming in first time
      this.authLoadedSub = this.userAuth.loaded$.subscribe((loaded) => {
        if (loaded && this.canEditPolicy && this.endorsementStatusService.canEditEndorsement.value) {
          if (this.policyLayerData.length == 0) {
            this.addPolicyLayer();
          }
          else {
            this.policyLayerData.forEach(policyLayer => {
              if (policyLayer.reinsuranceData.length == 0) {
                this.addReinsurance(policyLayer);
              }
            });
          }
        }
        // This prevent the add button being visible will still loading, can be slow whne first opening
        this.loading = false;
      });  
    });
    this.statusSub = this.endorsementStatusService.canEditEndorsement.subscribe({
      next: canEdit => {
        this.canEditEndorsement = canEdit;
      }
    });

    this.reinsuranceRefreshedSub = this.reinsuranceLookupService.refreshed$.subscribe(async () => {
       console.log("Refresh Load");
       this.reinsuranceCodes = null;
       this.reinsuranceFacCodes = null;
    });
  }


  async getReinsuranceCodes(): Promise<ReinsuranceLookup[]> {
    if (this.reinsuranceCodes == null) {
      console.log("Refresh reinsurance");
      await this.reinsuranceLookupService.getReinsurance(this.policyInfo.programId, this.policyInfo.policyEffectiveDate).toPromise().then(
        reisuranceCodes => {
          this.reinsuranceCodes = reisuranceCodes;
        }
      );
    }
      return this.reinsuranceCodes  ?? [];
  }


  async populateReinsuranceCodes(): Promise<void> {
    await this.reinsuranceLookupService.getReinsurance(this.policyInfo.programId, this.policyInfo.policyEffectiveDate).toPromise().then(
      reisuranceCodes => {
        this.reinsuranceCodes = reisuranceCodes;
      }
    );
  }


  async getReinsuranceFacCodes(): Promise<ReinsuranceLookup[]> {
    if (this.reinsuranceFacCodes == null) {
      console.log("Refresh reinsuranceFac");
      await this.reinsuranceLookupService.getFaculativeReinsurance(this.policyInfo.policyEffectiveDate).toPromise().then(
        reisuranceCodes => {
          this.reinsuranceFacCodes = reisuranceCodes;
        }
      );
    }
    return this.reinsuranceFacCodes ?? [];
  }

  async populateReinsuranceFacCodes(): Promise<void> {
    await this.reinsuranceLookupService.getFaculativeReinsurance(this.policyInfo.policyEffectiveDate).toPromise().then(
      reisuranceCodes => {
        this.reinsuranceFacCodes = reisuranceCodes;
      }
    );
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
    this.statusSub?.unsubscribe();
    this.authLoadedSub?.unsubscribe();
    this.reinsuranceRefreshedSub?.unsubscribe();
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy
  }

  addPolicyLayer(): void {
    let policyLayer = newPolicyLayer(this.policyId, this.endorsementNumber,this.getNextPolicyLayerSequence());
    this.addReinsurance(policyLayer);
    this.policyLayerData.push(policyLayer);
  }

  async addReinsurance(policyLayerData: PolicyLayerData) {
    let reinsuranceLayer = newReinsuranceLayer(this.policyId, this.endorsementNumber, policyLayerData.policyLayerNo, this.getNextReinsuranceLayerSequence(policyLayerData));
    policyLayerData.reinsuranceData.push(reinsuranceLayer)

    // For first layer copy attachment point and limit
    if (reinsuranceLayer.policyLayerNo == 1 && reinsuranceLayer.reinsLayerNo == 1) {
      reinsuranceLayer.attachmentPoint = this.endorsement.attachmentPoint;
      reinsuranceLayer.reinsLimit = this.endorsement.limit;
    }
    // If Policy layer data is set when there is no reinsurance and the amount does not match the full premium then we can assume it was populated during import and should be used
    if (policyLayerData.policyLayerPremium !== undefined && policyLayerData.policyLayerPremium > 0 && (policyLayerData.policyLayerPremium ?? 0) != this.endorsement.premium && policyLayerData.reinsuranceData.length == 1) {
      reinsuranceLayer.reinsCededPremium = policyLayerData.policyLayerPremium;
    }
    if (policyLayerData.policyLayerLimit !== undefined && policyLayerData.policyLayerLimit > 0 && policyLayerData.reinsuranceData.length == 1) {
      reinsuranceLayer.reinsLimit = policyLayerData.policyLayerLimit;
    }

    let match: any = null;
    if (reinsuranceLayer.reinsLayerNo == 1) {
      match = (await this.getReinsuranceCodes()).find(c => c.layerNumber == reinsuranceLayer.policyLayerNo && c.isDefault);
      if (match != null) {
        reinsuranceLayer.treatyNo = match?.treatyNumber;
        reinsuranceLayer.reinsCededCommRate = match?.cededCommissionRate ?? 0;
      }
    }
  }

  getNextPolicyLayerSequence(): number {
    if (this.policyLayerData.length == 0) {
      return 1;
    }
    else {
      let policyLayerNo = Math.max(...this.policyLayerData.map(o => o.policyLayerNo)) + 1;
      return policyLayerNo;
    }
  }

  getNextReinsuranceLayerSequence(policyLayerData: PolicyLayerData): number {
    if (policyLayerData.reinsuranceData.length == 0) {
      return 1;
    }
    else {
      let reinsuranceLayerNo = Math.max(...policyLayerData.reinsuranceData.map(o => o.reinsLayerNo)) + 1;
      return reinsuranceLayerNo;
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
    let insuringAgreements = false;
    if (this.canEdit) {
      this.policyLayerData.forEach(group => { group.reinsuranceData.forEach(layer => { totalPrem += layer.reinsCededPremium ?? 0 }) });
      this.policyLayerData.forEach(group => { group.reinsuranceData.forEach(layer => { totalLimit += layer.reinsLimit ?? 0 }) });
      subAttachmentpoints = this.checkSubAttachmentPoints()
      insuringAgreements = this.checkAgreementLimits()

      if (this.components != null) {
        for (let child of this.components) {
          if (!child.isValid()) {
            this.endorsementStatusService.reinsuranceValidated = false;
            return false;
          }
        }
      }
      const totalMatches = this.headerComp.endorsement.premium == totalPrem && this.headerComp.endorsement.limit == totalLimit &&
        this.policyLayerData[0].reinsuranceData[0].attachmentPoint == this.headerComp.endorsement.attachmentPoint && subAttachmentpoints && insuringAgreements && this.checkAgreements();

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
    if(!this.checkAgreements()){
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
    this.policyLayerData.forEach(group => { group.reinsuranceData.forEach(layer => { total += layer.reinsCededPremium ?? 0 }) });
    return this.headerComp.endorsement.premium == total
  }

  checkLimitMatches(): boolean {
    let total: number = 0;
    this.policyLayerData.forEach(group => { group.reinsuranceData.forEach(layer => { total += layer.reinsLimit ?? 0 }) });
    return this.headerComp.endorsement.limit == total
  }

  checkAgreements(): boolean {
    let failed: boolean = false;
    let filteredList: ReinsuranceLookup[];
    let comboList = [];

    this.policyLayerData.forEach(group => {
      group.reinsuranceData.forEach(async layer => {
        comboList = (await this.getReinsuranceCodes()).concat(await this.getReinsuranceFacCodes());
        filteredList = comboList.filter(x => x.treatyNumber == layer.treatyNo);
        if (filteredList.length == 0) {
          this.invalidMessage += "<br><li>Agreement is no longer valid for Policy Layer #:" + layer.policyLayerNo + ", Reinsurance Layer #:" + layer.reinsLayerNo;
          failed = true;
        }
      })
    });
    return !failed;
  }

  checkAgreementLimits(): boolean {
    let failed: boolean = false;
    let filteredList: number | undefined = 0;
    let comboList = [];

    this.policyLayerData.forEach(group => {
      group.reinsuranceData.forEach(async layer => {
        if (layer.treatyNo == 1) {
          if ((layer.reinsLimit ?? 0) > (this.headerComp.endorsement.limit ?? 0)) {
            this.invalidMessage += "<br><li>Policy Layer #:" + layer.policyLayerNo + ", Reinsurance Layer #:" + layer.reinsLayerNo + ". Max Layer Limit is: " + this.headerComp.endorsement.limit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            failed = true;
          }
        }
        else if (layer.treatyNo !== 1) {
          comboList = (await this.getReinsuranceCodes()).concat(await this.getReinsuranceFacCodes())
          filteredList = comboList.find(x => x.treatyNumber == layer.treatyNo)?.maxLayerLimit
          if (filteredList != null)
            if ((layer.reinsLimit ?? 0) > filteredList) {
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
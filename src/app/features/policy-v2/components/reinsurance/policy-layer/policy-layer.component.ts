import { Component, Input, Output } from '@angular/core';
import { Endorsement, PolicyInformation, PolicyLayerData, ReinsuranceLayerData, newReinsuranceLayer } from 'src/app/features/policy/models/policy';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { EventEmitter } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { ReinsuranceClass } from '../../../classes/reinsurance-class';
import { ReinsuranceLookup } from 'src/app/features/policy/services/reinsurance-lookup/reinsurance-lookup';
import { ReinsuranceLookupService } from 'src/app/features/policy/services/reinsurance-lookup/reinsurance-lookup.service';
import { ActivatedRoute } from '@angular/router';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { EndorsementStatusService } from 'src/app/features/policy/services/endorsement-status/endorsement-status.service';

@Component({
  selector: 'rsps-policy-layer',
  templateUrl: './policy-layer.component.html',
  styleUrls: ['./policy-layer.component.css']
})
export class PolicyLayerComponent {
  // Icon imports
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;

  // Toggles whether panel is open or minimzed.
  policyLayerCollapsed = false;

  // Check if user has edit rights. Values are subscribed to userAuth and endorsementStatusService.
  canEditPolicy = false;
  canEditEndorsement = false;

  // Data needed to create new reinsurance layers
  @Input() endorsement!: Endorsement;

  /**
   * To implement lazy deletion of reinsurance layers, `policyLayerData.reinsuranceData`
   * is used to create `reinsuranceLayers`. Each ReinsuranceClass is associated with a
   * reinsurance layer and handles validation and lazy deletion logic.
   * `policyLayerData` is then ignored.
   */
  @Input() policyLayerData!: PolicyLayerData;
  reinsuranceLayers!: ReinsuranceClass[];

  @Output() deletePolicyLayer: EventEmitter<PolicyLayerData> = new EventEmitter();

  // For looking up reinsurance codes
  // reinsuranceRefreshedSub!: Subscription;
  reinsuranceCodes!: ReinsuranceLookup[];
  reinsuranceFacCodes!: ReinsuranceLookup[];
  policyInfo!: PolicyInformation;

  constructor(private route: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService,
    private reinsuranceLookupService: ReinsuranceLookupService,
    private userAuth: UserAuth,
    private endorsementStatusService: EndorsementStatusService) {
  }

  ngOnInit() {
    this.userAuth.canEditPolicy$.subscribe((canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy);
    this.endorsementStatusService.canEditEndorsement.subscribe((canEditEndorsement: boolean) => this.canEditEndorsement = canEditEndorsement);

    this.route.parent?.data.subscribe(async data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
      // Get values for reinsurance code drop down
      this.reinsuranceLookupService.getReinsurance(this.policyInfo.programId, this.policyInfo.policyEffectiveDate).subscribe(
        reinsurnaceCodes => {
          this.reinsuranceCodes = reinsurnaceCodes;
        }
      )
      this.reinsuranceLookupService.getFaculativeReinsurance(this.policyInfo.policyEffectiveDate).subscribe(
        facultativeReinsuranceCodes => {
          this.reinsuranceFacCodes = facultativeReinsuranceCodes;
        }
      )
    });
  }

  ngOnChanges() {
    this.reinsuranceLayers = this.policyLayerData.reinsuranceData.map(x => new ReinsuranceClass(x));
    // Add default reinsurance layer if this policy layer is newly created
    if (this.reinsuranceLayers.length == 0) {
      this.addNewReinsuranceLayer();
    }
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy;
  }

  addNewReinsuranceLayer() {
    this.policyLayerCollapsed = false;
    const reinsuranceLayer = newReinsuranceLayer(this.endorsement.policyId, this.endorsement.endorsementNumber, this.policyLayerData.policyLayerNo, this.reinsuranceLayers.length + 1);
    this.reinsuranceLayers.push(new ReinsuranceClass(reinsuranceLayer));
  }

  totalPolicyLayerLimit(): number {
    return this.reinsuranceLayers
      .map(d => Number(d.reinsLimit) || 0)
      .reduce((sum, summand) => sum + summand, 0);
  }

  totalPolicyLayerPremium(): number {
    return this.reinsuranceLayers
      .map(d => Number(d.reinsCededPremium) || 0)
      .reduce((sum, summand) => sum + summand, 0);
  }

  openDeleteConfirmation(reinsurance: ReinsuranceClass) {
    this.confirmationDialogService.open('Delete Confirmation', 'Are you sure you want to delete this Reinsurnace Layer?')
    .then((confirm: boolean) => {
      if (confirm) {
          let index = this.reinsuranceLayers.indexOf(reinsurance);
          if (index == 0 && this.reinsuranceLayers.length == 1) {
            // When the last reinsurance layer is deleted, delete the policy layer.
            // Sibling policy layers must be updated, so we defer this logic to the containing PolicyReinsurnaceComponent.
            this.deletePolicyLayer.emit(this.policyLayerData);
          } else {
            // Update reinsurnace array and RLNs
            this.reinsuranceLayers.splice(index, 1)
            this.reinsuranceLayers.forEach((reinsurance, index) => (reinsurance.reinsLayerNo = index + 1))
          }
      }
    });
  }

  onSetFacultative(reinsurnace: ReinsuranceClass) {
    reinsurnace.treatyNo = null;
    reinsurnace.reinsCertificateNo = null;
  }

  currentReinsuranceCodes(reinsurnace: ReinsuranceClass): ReinsuranceLookup[] {
    return reinsurnace.isFacultative ? this.reinsuranceFacCodes : this.reinsuranceCodes;
  }

  onChangeReinsurnaceCode(reinsurance: ReinsuranceClass): void {
    const match = this.currentReinsuranceCodes(reinsurance).find(code => code.treatyNumber == reinsurance.treatyNo);
    if (match != null) {
      reinsurance.reinsCededCommRate = match.cededCommissionRate;
    }
  }
}

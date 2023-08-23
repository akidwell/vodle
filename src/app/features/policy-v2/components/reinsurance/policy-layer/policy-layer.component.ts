import { Component, Input, Output } from '@angular/core';
import { Endorsement, PolicyInformation, PolicyLayerData } from 'src/app/features/policy/models/policy';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { EventEmitter } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { ReinsuranceClass } from '../../../classes/reinsurance-class';
import { ReinsuranceLookup } from 'src/app/features/policy/services/reinsurance-lookup/reinsurance-lookup';
import { ReinsuranceLookupService } from 'src/app/features/policy/services/reinsurance-lookup/reinsurance-lookup.service';
import { ActivatedRoute } from '@angular/router';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { EndorsementStatusService } from 'src/app/features/policy/services/endorsement-status/endorsement-status.service';
import { PolicyLayerClass } from '../../../classes/policy-layer-class';

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

  @Input() policyLayer!: PolicyLayerClass;

  @Output() deletePolicyLayer: EventEmitter<PolicyLayerClass> = new EventEmitter();

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
    // Add default reinsurance layer if this policy layer is newly created
    if (this.policyLayer.reinsuranceData.length == 0) {
      this.addNewReinsuranceLayer();
    }
  }

  get canEdit(): boolean {
    return this.canEditEndorsement && this.canEditPolicy;
  }

  addNewReinsuranceLayer() {
    this.policyLayerCollapsed = false;
    const reinsuranceLayer = ReinsuranceClass.create(this.policyLayer, this.endorsement.policyId, this.endorsement.endorsementNumber, this.policyLayer.policyLayerNo, this.policyLayer.reinsuranceLayers.length + 1);
    this.policyLayer.reinsuranceData.push(reinsuranceLayer);
  }

  openDeleteConfirmation(reinsurance: ReinsuranceClass) {
    this.confirmationDialogService.open('Delete Confirmation', 'Are you sure you want to delete this Reinsurnace Layer?')
    .then((confirm: boolean) => {
      if (confirm) {
        this.policyLayer.deleteReinsuranceLayer(reinsurance);
        if (this.policyLayer.reinsuranceLayers.length == 0) {
          // When the last reinsurance layer is deleted, delete the policy layer.
          // Sibling policy layers must be updated, so we defer this logic to the containing PolicyReinsurnaceComponent.
          this.deletePolicyLayer.emit(this.policyLayer);
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

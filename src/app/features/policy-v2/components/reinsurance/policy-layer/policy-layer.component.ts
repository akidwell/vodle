import { Component, Input, Output } from '@angular/core';
import { PolicyInformation, PolicyLayerData, ReinsuranceLayerData, newReinsuranceLayer } from 'src/app/features/policy/models/policy';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { EventEmitter } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { ReinsuranceClass } from '../../../classes/reinsurance-class';
import { ReinsuranceLookup } from 'src/app/features/policy/services/reinsurance-lookup/reinsurance-lookup';
import { ReinsuranceLookupService } from 'src/app/features/policy/services/reinsurance-lookup/reinsurance-lookup.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'rsps-policy-layer',
  templateUrl: './policy-layer.component.html',
  styleUrls: ['./policy-layer.component.css']
})
export class PolicyLayerComponent {
  // Icon imports
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;

  // Toggles whether panel is open or minimzed
  policyLayerCollapsed = false;

  // Data needed to create new reinsurance layers
  @Input() policyId!: number;
  @Input() endorsementNumber!: number;

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

  constructor(private route: ActivatedRoute, private confirmationDialogService: ConfirmationDialogService, private reinsuranceLookupService: ReinsuranceLookupService) {

  }

  ngOnInit() {
    this.route.parent?.data.subscribe(async data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
    });
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
  }

  ngOnChanges() {
    this.reinsuranceLayers = this.policyLayerData.reinsuranceData.map(x => new ReinsuranceClass(x, this));
    // Add default reinsurance layer if this policy layer is newly created
    if (this.reinsuranceLayers.length == 0) {
      this.addNewReinsuranceLayer();
    }
  }

  addNewReinsuranceLayer() {
    this.policyLayerCollapsed = false;
    const reinsuranceLayer = newReinsuranceLayer(this.policyId, this.endorsementNumber, this.policyLayerData.policyLayerNo, this.reinsuranceLayers.length + 1);
    this.reinsuranceLayers.push(new ReinsuranceClass(reinsuranceLayer, this));
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
            // Deleting last reinsurnace layer -> delete policy layer
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

  setFacultative(reinsurnace: ReinsuranceClass) {
    reinsurnace.treatyNo = null;
    reinsurnace.reinsCertificateNo = null;
  }

  currentReinsuranceCodes(reinsurnace: ReinsuranceClass): ReinsuranceLookup[] {
    return reinsurnace.isFacultative ? this.reinsuranceFacCodes : this.reinsuranceCodes;
  }

  changeReinsurerCode(reinsurance: ReinsuranceClass): void {
    const match = this.currentReinsuranceCodes(reinsurance).find(code => code.treatyNumber == reinsurance.treatyNo);
    if (match != null) {
      reinsurance.reinsCededCommRate = match.cededCommissionRate;
    }
  }
}

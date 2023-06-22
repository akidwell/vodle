import { Component, Input, Output } from '@angular/core';
import { PolicyLayerData, ReinsuranceLayerData } from 'src/app/features/policy/models/policy';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { EventEmitter } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'rsps-policy-layer',
  templateUrl: './policy-layer.component.html',
  styleUrls: ['./policy-layer.component.css']
})
export class PolicyLayerComponent {
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;

  policyLayerCollapsed = false;

  @Input() policyLayerData!: PolicyLayerData;
  @Output() addReinsurance: EventEmitter<PolicyLayerData> = new EventEmitter();

  constructor(private confirmationDialogService: ConfirmationDialogService) {

  }

  // Called from Add New Reinsurance Layer button
  addNewReinsuranceLayer(): void {
    // Event handled by addReinsurance in PolicyReinsuranceComponent.
    // That component handles layer and reinsurance logic.
    this.addReinsurance.emit(this.policyLayerData);
    this.policyLayerCollapsed = false;
  }

  totalPolicyLayerLimit(): number {
    return this.policyLayerData.reinsuranceData
      .map(d => Number(d.reinsLimit) || 0)
      .reduce((total, next) => total + next, 0);
  }

  totalPolicyLayerPremium(): number {
    return this.policyLayerData.reinsuranceData
      .map(d => Number(d.reinsCededPremium) || 0)
      .reduce((total, next) => total + next, 0);
  }

  openDeleteConfirmation(reinsurance: ReinsuranceLayerData) {
    this.confirmationDialogService.open('Delete Confirmation', 'Are you sure you want to delete this Reinsurnace Layer?')
    .then((confirm: boolean) => {
      if (confirm) {
        if (reinsurance.reinsLayerNo)
        console.log('delete me!');
      }
    });
  }
}

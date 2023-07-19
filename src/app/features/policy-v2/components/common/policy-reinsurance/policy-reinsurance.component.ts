import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Endorsement, PolicyLayerData, newPolicyLayer } from 'src/app/features/policy/models/policy';

/**
 * Policy v2 Reinsurance Tab
 * 
 * PolicyReinsurnaceComponent
 *  - PolicyLayerComponent
 *    - ReinsuranceClass
 */

@Component({
  selector: 'rsps-policy-reinsurance',
  templateUrl: './policy-reinsurance.component.html',
  styleUrls: ['./policy-reinsurance.component.css']
})
export class PolicyReinsuranceComponent {

  private policyId!: number;
  private endorsementNumber!: number;
  policyLayerData!: PolicyLayerData[];
  endorsement!: Endorsement;

  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(async data => {
      this.endorsement = data['endorsementData'].endorsement;
      this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
      this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
    })
    this.policyLayerData = [];
  }

  /**
   * Adds a new policy layer.
   * The PolicyLayerComponent handles initialization of the default reinsurnace layer.
   */
  addPolicyLayer(): void {
    // Seq is 1 if no layers, otherwise increment max layer no.
    const nextLayerSeq = Math.max(0, ...this.policyLayerData.map(d => d.policyLayerNo)) + 1
    const policyLayer = newPolicyLayer(this.policyId, this.endorsementNumber, nextLayerSeq);
    this.policyLayerData.push(policyLayer);
  }

  /**
   * Deletes a policy layer.
   * The only way to delete a policy layer is to delete the last reinsurance layer within the policy.
   * Each policy layer handles the reinsurnace layer logic, so when a policy layer's last reinsurance layer
   * is deleted, it emits an event, letting this PolicyReinsurnaceComponent handle policy layer deletion.
   * @param policyLayer The PolicyLayerData to delete
   */
  deletePolicyLayer(policyLayer: PolicyLayerData) {
    const index = this.policyLayerData.indexOf(policyLayer);
    this.policyLayerData.splice(index, 1);
    this.policyLayerData.forEach((layer, index) => {
      layer.policyLayerNo = index + 1;
      layer.reinsuranceData.forEach(x => x.policyLayerNo = index + 1);
    })
  }
}

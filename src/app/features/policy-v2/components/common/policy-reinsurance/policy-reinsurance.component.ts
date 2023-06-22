import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Endorsement, PolicyLayerData, newPolicyLayer, newReinsuranceLayer } from 'src/app/features/policy/models/policy';

@Component({
  selector: 'rsps-policy-reinsurance',
  templateUrl: './policy-reinsurance.component.html',
  styleUrls: ['./policy-reinsurance.component.css']
})
export class PolicyReinsuranceComponent {

  policyId!: number;
  endorsementNumber!: number;
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
   * Adds Reinsurance to PolicyLayer data.
   * Subscribed to PolicyLayerGroup's addReinsurnace EventEmitter.
   * @param data PolicyLayerData the reinsurance belongs to.
   */
  addReinsurance(data: PolicyLayerData) {
    // Seq is 1 if no reinsurance, otherwise increment max layer no.
    const nextLayerSeq = Math.max(0, ...data.reinsuranceData.map(d => d.reinsLayerNo)) + 1;
    const reinsuranceLayer = newReinsuranceLayer(this.policyId, this.endorsementNumber, data.policyLayerNo, nextLayerSeq)
    data.reinsuranceData.push(reinsuranceLayer)
  }

  /**
   * Called by Add Policy Layer button.
   */
  addPolicyLayer(): void {
    // Seq is 1 if no layers, otherwise increment max layer no.
    const nextLayerSeq = Math.max(0, ...this.policyLayerData.map(d => d.policyLayerNo)) + 1
    const policyLayer = newPolicyLayer(this.policyId, this.endorsementNumber, nextLayerSeq);
    this.policyLayerData.push(policyLayer);
    this.addReinsurance(policyLayer);
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Endorsement, PolicyLayerData, newPolicyLayer } from 'src/app/features/policy/models/policy';
import { PolicyLayerClass } from '../../../classes/policy-layer-class';
import { EndorsementClass } from '../../../classes/endorsement-class';

/**
 * Policy v2 Reinsurance Tab
 * 
 * PolicyReinsurnaceComponent
 *  - PolicyLayerComponent <-> PolicyLayerClass
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
  endorsement!: EndorsementClass;

  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(async data => {
      this.endorsement = data['policyInfoData'].policyInfo.endorsementData;
      if (this.endorsement.policyLayers === undefined) {
        this.endorsement.policyLayers = [];
      }
      this.endorsementNumber = Number(this.route.parent?.snapshot.paramMap.get('end') ?? 0);
      this.policyId = Number(this.route.parent?.snapshot.paramMap.get('id') ?? 0);
    })
  }

  /**
   * Adds a new policy layer.
   * The PolicyLayerComponent handles initialization of the default reinsurnace layer.
   */
  addPolicyLayer(): void {
    // Seq is 1 if no layers, otherwise increment max layer no.
    const nextLayerSeq = Math.max(0, ...this.endorsement.policyLayers.map(d => d.policyLayerNo)) + 1
    const policyLayer = new PolicyLayerClass(this.policyId, this.endorsementNumber, nextLayerSeq);
    this.endorsement.policyLayers.push(policyLayer);
  }

  deletePolicyLayer(policyLayer: PolicyLayerClass) {
    this.endorsement.deletePolicyLayer(policyLayer);
  }

  getAlerts(): string | null {
    return this.endorsement.errorMessagesList
      .map(e => `<li>${e.message}</li>`)
      .reduce((alert, message) => alert += message, '');
  }
}

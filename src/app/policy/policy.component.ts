import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Policy, PolicyResolved } from './policy';

@Component({
  selector: 'rsps-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['../app.component.css', './policy.component.css']
})
export class PolicyComponent implements OnInit {
  data: any;
  policy: Policy = { policyId: 0, policySymbol: "", fullPolicyNumber: "" };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {

    const resolvedData: PolicyResolved = this.route.snapshot.data['resolvedData'];
    
    this.policy = resolvedData.policy ?? { policyId: 0, policySymbol: "", fullPolicyNumber: "" };

    // still experimenting with this
    // this.route.data.subscribe(data => {
    //   const resolvedData: IPolicyResolved = data['resolvedData'];
    //   this.test = resolvedData.policy.PolicyNumber;
    //   // this.errorMessage = resolvedData.error;
    //   // this.onProductRetrieved(resolvedData.product);
    // });
  }

  onSubmit() { }

}

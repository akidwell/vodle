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
  // policy: Policy = { policyId: 0, policySymbol: "", fullPolicyNumber: "" };
  policy!: Policy;
  policyNumber: string = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.policy = data['resolvedData'].policy;
      this.policyNumber = this.policy.policySymbol + this.policy.fullPolicyNumber;
    });
  }

  onSubmit() { }

}

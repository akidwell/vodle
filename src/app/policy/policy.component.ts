import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountInformation, Policy } from './policy';

@Component({
  selector: 'rsps-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['../app.component.css', './policy.component.css']
})
export class PolicyComponent implements OnInit {
  data: any;
  policy!: Policy;

  policyNumber: string = "";
  accountInformation!: AccountInformation;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.policy = data['resolvedData'].policy;
      this.accountInformation = data['accountData'].accountData;
      this.policyNumber = this.policy.policySymbol + this.policy.fullPolicyNumber;
    });
  }

  onSubmit() { }

}

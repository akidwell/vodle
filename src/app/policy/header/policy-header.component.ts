import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountInformation, PolicyInformation } from '../policy';

@Component({
  selector: 'rsps-policy-header',
  templateUrl: './policy-header.component.html',
  styleUrls: ['./policy-header.component.css']
})
export class PolicyHeaderComponent implements OnInit {
  accountInfo!: AccountInformation;
  policyInfo!: PolicyInformation;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.accountInfo = data['accountData'].accountInfo;
      this.policyInfo = data['policyInfoData'].policyInfo;
    });
  }

}

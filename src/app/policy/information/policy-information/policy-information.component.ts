import { Component, OnInit } from '@angular/core';
import { AccountInformation, Policy, PolicyInformation, QuoteData } from 'src/app/policy/policy';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'rsps-policy-information',
  templateUrl: './policy-information.component.html',
  styleUrls: ['./policy-information.component.css']
})
export class PolicyInformationComponent implements OnInit {
  policy!: Policy;
  isReadOnly: boolean = true;
  policyCollapsed = false;
  faPlus = faPlus;
  faMinus = faMinus;
  accountInfo!: AccountInformation;
  policyInfo!: PolicyInformation;
  quoteData!: QuoteData;

  
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policy = data['resolvedData'].policy;
      this.accountInfo = data['accountData'].accountInfo;
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.quoteData = data['policyInfoData'].quoteData;
      console.log(this.quoteData)
    });
  }

}

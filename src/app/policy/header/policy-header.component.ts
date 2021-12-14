import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountInformation, PolicyInformation } from '../policy';
import { PolicyStatusService } from '../services/policy-status.service';

@Component({
  selector: 'rsps-policy-header',
  templateUrl: './policy-header.component.html',
  styleUrls: ['./policy-header.component.css']
})
export class PolicyHeaderComponent implements OnInit {
  accountInfo!: AccountInformation;
  policyInfo!: PolicyInformation;
  endorsementNumber: number = 0;
  statusSub!: Subscription;
  status: string = "";

  constructor(private route: ActivatedRoute, private policyStatusService: PolicyStatusService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.accountInfo = data['accountData'].accountInfo;
      this.policyInfo = data['policyInfoData'].policyInfo;
      this.endorsementNumber = Number(this.route.snapshot.paramMap.get('end') ?? 0);
    });

    this.statusSub = this.policyStatusService.status.subscribe({
      next: status => {
        this.status = status;
      }
    }); 
  }

  ngOnDestroy(): void {
    this.statusSub?.unsubscribe();
  }

}

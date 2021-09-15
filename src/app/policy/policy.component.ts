import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastService } from './information/policy-information/toast-service';
import { Policy, PolicyInformation } from './policy';
import { PolicyService } from './policy.service';

@Component({
  selector: 'rsps-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['../app.component.css', './policy.component.css']
})
export class PolicyComponent implements OnInit {
  data: any;
  updateSub: Subscription | undefined;
  policyInfo!: PolicyInformation;
  constructor(private route: ActivatedRoute,private policyService: PolicyService,private toastService: ToastService) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.policyInfo = data['policyInfoData'].policyInfo;
    });
  }

  onSubmit() { }

  onChange() {
    // this.updateSub = this.policyService.putPolicyInfo(this.policyInfo).subscribe({
    //   next: () => {
    //     this.toastService.show('Policy successfully saved.', { classname: 'bg-success text-light', delay: 5000});
    //   }
    // });
  }
}

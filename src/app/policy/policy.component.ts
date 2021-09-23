import { Component,OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from '../notification/notification-service';
import { PolicyInformation } from './policy';
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
  formstatus!: string;

  constructor(private route: ActivatedRoute,private policyService: PolicyService,private notification: NotificationService) { }

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

  @ViewChild("myRouterOutlet", { static: true }) routerOutlet!: RouterOutlet;

onActivate(event : any) {
  console.log(event)
  event.status.subscribe((res: any) => { 
   this.formstatus = res;
   console.log(res)
    }
    
  )}
}
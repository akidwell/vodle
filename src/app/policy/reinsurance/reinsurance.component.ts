import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { NotificationService } from 'src/app/notification/notification-service';
import { PolicyLayerData } from '../policy';
import { PolicyService } from '../policy.service';

@Component({
  selector: 'rsps-reinsurance',
  templateUrl: './reinsurance.component.html',
  styleUrls: ['./reinsurance.component.css']
})
export class ReinsuranceComponent implements OnInit {

  policyLayerData!: PolicyLayerData[];
  canEditPolicy: boolean = false;
  authSub: Subscription;
  canEditTransactionType: boolean = false;


  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private dropdowns: DropDownsService, private policyService: PolicyService, private datePipe: DatePipe, private notification: NotificationService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.policyLayerData = data['policyLayerData'].policyLayer;
      console.log(this.policyLayerData)
      this.canEditTransactionType = Number(this.route.snapshot.paramMap.get('end') ?? 0) > 0;
    });

  }
}
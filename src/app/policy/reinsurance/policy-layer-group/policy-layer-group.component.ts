import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/authorization/user-auth';
import { DropDownsService } from 'src/app/drop-downs/drop-downs.service';
import { NotificationService } from 'src/app/notification/notification-service';
import { Endorsement, PolicyLayerData } from '../../policy';
import { PolicyService } from '../../policy.service';

@Component({
  selector: 'rsps-policy-layer-group',
  templateUrl: './policy-layer-group.component.html',
  styleUrls: ['./policy-layer-group.component.css']
})
export class PolicyLayerGroupComponent implements OnInit {
  endorsement!: Endorsement;
  isReadOnly: boolean = true;
  canEditPolicy: boolean = false;
  authSub: Subscription;
  canEditTransactionType: boolean = false;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  policyLayerCollapsed = false;
  policyLayer!: PolicyLayerData[];

  @Input() policyLayerData!: PolicyLayerData;



  constructor(private route: ActivatedRoute, private userAuth: UserAuth, private dropdowns: DropDownsService, private policyService: PolicyService, private datePipe: DatePipe, private notification: NotificationService) {
    this.authSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.endorsement = data['endorsementData'].endorsement;
      this.policyLayer = data['policyLayerData'].policyLayerData;
      console.log(this.policyLayerData)
      console.log(this.policyLayerData.policyLayerNo)
      this.canEditTransactionType = Number(this.route.snapshot.paramMap.get('end') ?? 0) > 0;
    });

  }
}

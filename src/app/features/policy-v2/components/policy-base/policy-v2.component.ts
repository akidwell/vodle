import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { PreviousRouteService } from 'src/app/core/services/previous-route/previous-route.service';
import { PolicyClass } from '../../classes/policy-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { AccountInformation } from 'src/app/features/policy/models/policy';
import { PropertyDataService } from 'src/app/features/quote/services/property-data.service';

@Component({
  selector: 'rsps-policy-v2',
  templateUrl: './policy-v2.component.html',
  styleUrls: ['./policy-v2.component.css']
})
export class PolicyV2Component extends SharedComponentBase implements OnInit {
  prevSub!: Subscription;
  previousUrl = '';
  previousLabel = 'Previous';
  policy!: PolicyClass;
  accountData!: AccountInformation;
  isSaving = false;
  saveSub!: Subscription;
  faSave = faSave;

  programSub!: Subscription;

  constructor(public headerPaddingService: HeaderPaddingService,
    private route: ActivatedRoute,
    private previousRouteService: PreviousRouteService,
    private router: Router,
    public propertyDataService: PropertyDataService,
    userAuth: UserAuth) {
    super(userAuth);
  }
  ngOnInit(): void {
    this.handleSecurity(this.type);
    this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
      this.previousLabel = this.previousRouteService.getPreviousUrlFormatted();
    });
    this.route?.data.subscribe(data => {
      console.log(data['accountData']);
      this.policy = data['policyInfoData'].policyInfo;
      this.policy.producer = data['policyInfoData'].policyInfo.producer;
      this.policy.insured = data['policyInfoData'].policyInfo.insured;
      this.accountData = data['accountData'].accountInfo;
      this.propertyDataService.buildingList = this.policy.endorsementData.buildingList;
    });
    console.log(this.route?.data);
    console.log(this.policy);
    // this.saveSub = this.quoteSavingService.isSaving$.subscribe(isSaving => this.isSaving = isSaving);
  }

  ngOnDestroy() {
    this.prevSub?.unsubscribe();
    this.saveSub?.unsubscribe();
  }

  doRedirect() {
    const urlString = this.router.url.split('/').slice(0,-1).join('/')+'/information';
    setTimeout(()=> {
      this.router.navigate([urlString], { state: { bypassFormGuard: true } });
    });
  }

}

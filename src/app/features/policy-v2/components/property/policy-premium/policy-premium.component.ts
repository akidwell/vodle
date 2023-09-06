import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { FilteredBuildingsService } from 'src/app/shared/services/filtered-buildings/filtered-buildings.service';
import { PolicyClass } from '../../../classes/policy-class';
import { PolicySavingService } from '../../../services/policy-saving-service/policy-saving.service';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';

@Component({
  selector: 'rsps-policy-premium',
  templateUrl: './policy-premium.component.html',
  styleUrls: ['./policy-premium.component.css']
})
export class PolicyPremiumComponent {
  authSub: Subscription;
  canEdit = false;
  policyInfo!: PolicyClass;
  policySub!: Subscription;
  classType = ClassTypeEnum.Policy;
  isSaving = false;
  saveSub!: Subscription;
  rateEffectiveDate: Date | null= null;
  type = SharedComponentType.Policy;
  programId = 112;
  @Input() public propertyParent!: PolicyClass;

  constructor(private userAuth: UserAuth, private pageDataService: PageDataService, private policySavingService: PolicySavingService,filteredBuildingsService: FilteredBuildingsService) {
    this.authSub = this.userAuth.canEditQuote$.subscribe(
      (canEditQuote: boolean) => this.canEdit = canEditQuote
    );
  }

  ngOnInit(): void {
    this.saveSub = this.policySavingService.isSaving$.subscribe(
      (isSaving) => (this.isSaving = isSaving)
    );
  }

  ngAfterViewInit(): void {
    this.policySub = this.pageDataService.policyData$.subscribe(
      (policyData: PolicyClass | null) => {
        if (policyData != null) {
          setTimeout(() => {
            this.policyInfo = policyData as PolicyClass ?? new PolicyClass();
            this.programId = this.policyInfo.quoteData.programId;
            this.rateEffectiveDate = this.policyInfo.policyEffectiveDate;
            this.propertyParent = this.policyInfo;
          });
        }
      }
    );
    this.saveSub = this.policySavingService.isSaving$.subscribe(
      (isSaving) => (this.isSaving = isSaving)
    );
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.policySub?.unsubscribe();
  }

  getAlerts(): string | null{
    let alert = 'The following fields are invalid: ';
    this.policyInfo.getTabErrors('Premium').map(x => {
      alert += '<br><li>' + x.message ;
    });
    return alert;
  }
}

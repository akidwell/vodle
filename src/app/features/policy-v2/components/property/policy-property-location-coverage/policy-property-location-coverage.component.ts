import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { PolicyClass } from '../../../classes/policy-class';
import { PolicySavingService } from '../../../services/policy-saving-service/policy-saving.service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
import { PropertyBuildingBaseComponent } from 'src/app/shared/components/property-building/property-building-base-component/property-building-base-component';
import { FilteredBuildingsService } from 'src/app/shared/services/filtered-buildings/filtered-buildings.service';

@Component({
  selector: 'rsps-policy-property-location-coverage',
  templateUrl: './policy-property-location-coverage.component.html',
  styleUrls: ['./policy-property-location-coverage.component.css']
})
export class PolicyPropertyLocationCoverageComponent extends PropertyBuildingBaseComponent implements OnInit{
  authSub: Subscription;
  canEdit = false;
  policyInfo!: PolicyClass;
  policySub!: Subscription;
  classType = ClassTypeEnum.Policy;
  isSaving = false;
  saveSub!: Subscription;
  rateEffectiveDate: Date | null= null;
  programId = 112;

  @Input() public readOnlyQuote!: boolean;

  constructor(private userAuth: UserAuth, private pageDataService: PageDataService, private policySavingService: PolicySavingService,filteredBuildingsService: FilteredBuildingsService) {
    super(filteredBuildingsService);
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
            this.filterBuildings();
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
    let alert = 'Following fields are invalid: ';
    this.policyInfo.errorMessagesList.map(x => {
      alert += '<br><li>' + x.message ;
    });
    return alert;
  }
}

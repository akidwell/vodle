import { Component, Input, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { PolicySavingService } from '../../../services/policy-saving-service/policy-saving.service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { PolicyQuoteClass } from '../../../classes/policy-quote-class';
import { PolicyClass } from '../../../classes/policy-class';
import { PropertyMorgageeBaseComponent } from 'src/app/shared/components/property-mortgagee/property-mortgagee-base-component';
import { PropertyBuildingClass } from 'src/app/features/quote/classes/property-building-class';
import { FilteredBuildingsService } from 'src/app/shared/services/filtered-buildings/filtered-buildings.service';

@Component({
  selector: 'rsps-policy-property-mortgagee',
  templateUrl: './policy-property-mortgagee.component.html',
  styleUrls: ['./policy-property-mortgagee.component.css']
})
export class PolicyPropertyMortgageeComponent extends  PropertyMorgageeBaseComponent implements OnInit {
  authSub: Subscription;
  canEdit = false;
  policy!: PolicyClass;
  policySub!: Subscription;
  classType = ClassTypeEnum.Policy;
  isSaving = false;
  saveSub!: Subscription;
  rateEffectiveDate: Date | null= null;
  programId = 112;
  private _buildings: PropertyBuildingClass[] = [];

  @Input() public readOnlyQuote!: boolean;

  @Input() set buildings(value: PropertyBuildingClass[]) {
    this._buildings = value;
    console.log('input buildings: ', value);
  }
  get buildings(): PropertyBuildingClass[] {
    return this.filteredBuildingsService.filteredBuildings;
  }

  constructor(private userAuth: UserAuth, private pageDataService: PageDataService, private policySavingService: PolicySavingService, public filteredBuildingsService: FilteredBuildingsService) {
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
            this.policy = policyData as PolicyClass ?? new PolicyClass();
            this.programId = this.policy.quoteData.programId;
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
    this.policy.errorMessagesList.map(x => {
      alert += '<br><li>' + x.message ;
    });
    return alert;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PolicyClass } from '../../../classes/policy-class';
import { PolicySavingService } from '../../../services/policy-saving-service/policy-saving.service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { PolicyRate } from '../../../models/policy-rate';
import { PropertyPolicyDeductibleClass } from '../../../classes/property-policy-deductible-class';
import { PropertyDeductible, PropertyEndorsementDeductible, PropertyQuoteDeductible } from 'src/app/features/quote/models/property-deductible';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { PropertyQuoteDeductibleClass } from 'src/app/features/quote/classes/property-quote-deductible-class';

@Component({
  selector: 'rsps-policy-premium',
  templateUrl: './policy-premium.component.html',
  styleUrls: ['./policy-premium.component.css']
})
export class PolicyPremiumComponent implements OnInit {
    accountCollapsed = false;
    faAngleDown = faAngleDown;
    faAngleUp = faAngleUp;
    authSub: Subscription;
    public canEdit = false;
    policyInfo!: PolicyClass;
    policySub!: Subscription;
    classType = ClassTypeEnum.Policy;
    isSaving = false;
    saveSub!: Subscription;
    rateEffectiveDate: Date | null= null;
    programId = 112;
    programDesc: string = "";
    type = SharedComponentType.Policy;
    totalPrem: number = 0;
    deductibles: PropertyDeductible[] = [];

    @Input() public rate!: PolicyRate;
    @Input() public program!: ProgramClass;
    @Input() propertyParent!: PolicyClass;
  
    constructor(private notification: NotificationService, private userAuth: UserAuth, private pageDataService: PageDataService, private policySavingService: PolicySavingService) {
      console.log('premiumpolicycomponent constructor');
      this.authSub = this.userAuth.canEditPolicy$.subscribe(
        (canEditQuote: boolean) => this.canEdit = canEditQuote
      );

      this.policySub = this.pageDataService.policyData$.subscribe(
        (policyData: PolicyClass | null) => {
          if (policyData != null) {
            this.policyInfo = policyData as PolicyClass ?? new PolicyClass();
            this.programId = this.policyInfo.quoteData.programId;
            this.propertyParent = this.policyInfo;
            
            this.totalPrem = this.policyInfo.totalPremium;
            this.programDesc = this.policyInfo.programName;
            this.deductibles = this.policyInfo.endorsementData.endorsementDeductible;

            // setTimeout(() => {
            //   console.log('ngAfter timeout') 
            //   this.policy = policyData as PolicyClass ?? new PolicyClass();
            //   this.programId = this.policy.quoteData.programId;
            //   this.propertyParent = this.policy;
              
            //   this.totalPrem = this.policy.totalPremium;
            //   this.programDesc = this.policy.programName;
            //   console.log(this.policy);
            // });
          }
        }
      );
    }
  
    ngOnInit(): void {
      console.log('premiumpolicycomponent init');
      this.saveSub = this.policySavingService.isSaving$.subscribe(
        (isSaving) => (this.isSaving = isSaving)
      );
      
    }
  
    ngAfterViewInit(): void {
      console.log('ngAfter')
      
      // this.saveSub = this.policySavingService.isSaving$.subscribe(
      //   (isSaving) => (this.isSaving = isSaving)
      // );
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
    updatePremium(prem: number){
      this.policyInfo.endorsementData.premium = prem;
      this.totalPrem = this.policyInfo.totalPremium; //gets optional premium and premium for this coverage
    }  
    updateTerrorism(terrorCode: string){
      this.policyInfo.endorsementData.terrorismCode = terrorCode;
    } 


    updateYsNFlatRate(isFlatRate: boolean){
      this.policyInfo.endorsementData.rate.isFlatRate = isFlatRate;
    }
    updateRateBasis(rateBasis: number){
      this.policyInfo.endorsementData.rate.rateBasis = rateBasis;
    }
    updateFinalRate(finalRate: number){
      this.policyInfo.endorsementData.rate.premiumRate = finalRate;
    }


    addDeduct(){
      const newDeductible = new PropertyPolicyDeductibleClass();
      newDeductible.sequence = this.getNextSequence();
      newDeductible.isNew = true;
      this.policyInfo.endorsementData.endorsementDeductible.push(newDeductible);
    }

    copyDeduct(deductible: PropertyDeductible) {
      const copy = new PropertyPolicyDeductibleClass(deductible as PropertyPolicyDeductibleClass);
      copy.sequence = this.getNextSequence();
      copy.isNew = true;
      copy.guid = crypto.randomUUID();
      this.policyInfo.endorsementData.endorsementDeductible.push(copy);
    }

    deleteDeduct(deductible: PropertyDeductible){
      const index = this.deductibles?.findIndex(x => x.sequence == deductible.sequence);
      if (index > -1) {
        this.deductibles.find(x => x.sequence == deductible.sequence)!.markForDeletion = true;
        this.deductibles.forEach((deductible, index) => {
          deductible.sequence = index + 1;
        });
        this.policyInfo.endorsementData.markDirty();
      }
    }

    getNextSequence(): number {
      if (this.policyInfo.endorsementData.endorsementDeductible.length == 0) {
        return 1;
      }
      else {
        return Math.max(...this.policyInfo.endorsementData.endorsementDeductible.map(o => o.sequence ?? 0)) + 1;
      }
    }
    
}
  

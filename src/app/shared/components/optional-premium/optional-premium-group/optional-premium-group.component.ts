import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { OptionalPremiumClass } from 'src/app/shared/classes/optional-premium-class';
import { QuoteOptionalPremiumClass } from 'src/app/features/quote/classes/quote-optional-premium-class';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { PolicyOptionalPremiumClass } from 'src/app/features/policy/classes/policy-optional-premium-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';
import { Quote } from 'src/app/features/quote/models/quote';
import { QuoteLineItemClass } from 'src/app/features/quote/classes/quote-line-item-class';
import { Moment } from 'moment';

@Component({
  selector: 'rsps-optional-premium-group',
  templateUrl: './optional-premium-group.component.html',
  styleUrls: ['./optional-premium-group.component.css']
})
export class OptionalPremiumGroupComponent extends SharedComponentBase implements OnInit {
  invalidMessage = '';
  showInvalid = false;
  color: ThemePalette = 'warn';
  canDrag = false;
  dragDropClass = '';
  invalidList: string[] = [];
  isNew = false;
  collapsed = false;
  program!: ProgramClass | null;
  optionalPremiumData: OptionalPremiumClass[] = [];
  quoteLineItemData!: QuoteLineItemClass[];
  riskState!: string| null;
  effectiveDate!: Date | Moment | null;
  quoteId = 0;
  programSub!: Subscription;
  constructor(private notification: NotificationService, userAuth: UserAuth, private route: ActivatedRoute, private pageDataService: PageDataService) {
    super(userAuth);
  }

  ngOnInit(): void {
    console.log(this.type);
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        this.program = selectedProgram;
        if (this.program?.quoteData?.propertyQuote?.propertyOptionalPremium){
          this.optionalPremiumData = this.program?.quoteData?.propertyQuote.propertyOptionalPremium;
          this.quoteLineItemData = this.program?.quoteData?.quoteLineItems;
          this.riskState = this.program?.quoteData?.riskState;
          this.effectiveDate = this.program?.quoteData.policyEffectiveDate;
        }
      });
    this.collapsed = false;
    this.handleSecurity(this.type);
  }
  ngOnDestroy(): void {
    this.programSub.unsubscribe();
  }
  isValid(): boolean {
    let valid = true;
    this.invalidList = [];
    this.optionalPremiumData?.forEach(c => {
      if (!c.isValid) {
        valid = false;
        this.invalidList = this.invalidList.concat(c.invalidList);
      }
    });
    return valid;
  }

  isDirty() {
    return this.optionalPremiumData?.some(item => item.isDirty);
  }

  hideInvalid(): void {
    this.showInvalid = false;
  }

  copyOptionalPremium(optionalPremium: OptionalPremiumClass) {
    let newOptionalPremium: OptionalPremiumClass | null = null;

    if (optionalPremium instanceof PolicyOptionalPremiumClass) {
      const clone = optionalPremium.copy();
      newOptionalPremium = new PolicyOptionalPremiumClass(clone);
    }
    if (optionalPremium instanceof QuoteOptionalPremiumClass) {
      const clone = optionalPremium.copy();
      newOptionalPremium = new QuoteOptionalPremiumClass(clone);
    }
    if (newOptionalPremium !== null) {
      this.optionalPremiumData.push(newOptionalPremium);
    }
  }

  deleteExistingOptionalPremium(optionalPremium: OptionalPremiumClass) {
    const index = this.optionalPremiumData?.indexOf(optionalPremium, 0);
    if (index > -1) {
      this.optionalPremiumData?.splice(index, 1);
      if (!optionalPremium.isNew) {
        this.notification.show('Optional Premium deleted.', { classname: 'bg-success text-light', delay: 5000 });
      }
    }
  }

  addNewOptionalPremium(): void {
    let optionalPremium: OptionalPremiumClass | null;
    if (this.type === SharedComponentType.Policy) {
      optionalPremium = new PolicyOptionalPremiumClass();
      this.optionalPremiumData.push(optionalPremium);
    } else if (this.type === SharedComponentType.Quote) {
      optionalPremium = new QuoteOptionalPremiumClass();
      this.optionalPremiumData.push(optionalPremium);
    }
  }
}

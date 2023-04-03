import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { OptionalPremiumClass } from 'src/app/shared/classes/optional-premium-class';
import { QuoteOptionalPremiumClass } from 'src/app/features/quote/classes/quote-optional-premium-class';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { PolicyOptionalPremiumClass } from 'src/app/features/policy/classes/policy-optional-premium-class';
import { SharedComponentBase } from 'src/app/shared/component-base/shared-component-base';
import { QuoteLineItemClass } from 'src/app/features/quote/classes/quote-line-item-class';
import { Moment } from 'moment';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import * as moment from 'moment';
import { OptionalPremiumMapping } from 'src/app/shared/models/optional-premium-mapping';
import { Code } from 'src/app/core/models/code';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';

@Component({
  selector: 'rsps-optional-premium-group',
  templateUrl: './optional-premium-group.component.html',
  styleUrls: ['./optional-premium-group.component.css']
})
export class OptionalPremiumGroupComponent extends SharedComponentBase implements OnInit {
  deductibleTypes$: Observable<Code[]> | undefined;
  deductibleCodes$: Observable<Code[]> | undefined;
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
  deleteSub!: Subscription;
  coverages$!: Observable<OptionalPremiumMapping[]>;
  @Input() public totalPrem!: number | null;

  constructor(private notification: NotificationService,
    userAuth: UserAuth,
    private route: ActivatedRoute,
    private pageDataService: PageDataService,
    private quoteService: QuoteService,
    private dropdowns: DropDownsService) {
    super(userAuth);
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        this.program = selectedProgram;
        if (this.program?.quoteData instanceof PropertyQuoteClass && this.program?.quoteData?.propertyQuoteBuildingOptionalCoverage){
          this.optionalPremiumData = this.program?.quoteData?.propertyQuoteBuildingOptionalCoverage;
          this.quoteLineItemData = this.program?.quoteData?.quoteLineItems;
          this.riskState = this.program?.quoteData?.riskState;
          this.effectiveDate = this.program?.quoteData.policyEffectiveDate;
          this.deductibleTypes$ = this.dropdowns.getDeductibleTypes(this.program.programId);
          this.deductibleCodes$ = this.dropdowns.getDeductibleCodes(this.program.programId);
        }
      });
    const effectiveDate = moment.isMoment(this.effectiveDate) ? this.effectiveDate.format('YYYY-MM-DD HH:mm') : this.effectiveDate?.toString();

    this.coverages$ = this.dropdowns.getPropertyOptionalCoverages(this.program?.programId || 0, effectiveDate || moment.toString());
  }

  ngOnInit(): void {
    this.collapsed = false;
    this.handleSecurity(this.type);
  }
  ngOnDestroy(): void {
    this.programSub?.unsubscribe();
    this.deleteSub?.unsubscribe();
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
      clone.isNew = true;
      newOptionalPremium = new PolicyOptionalPremiumClass(clone);
    }
    if (optionalPremium instanceof QuoteOptionalPremiumClass) {
      const clone = optionalPremium.copy();
      clone.isNew = true;
      newOptionalPremium = new QuoteOptionalPremiumClass(clone);
    }
    if (newOptionalPremium !== null) {
      this.optionalPremiumData.push(newOptionalPremium);
    }
  }

  deleteExistingOptionalPremium(optionalPremium: OptionalPremiumClass) {
    if (optionalPremium instanceof PolicyOptionalPremiumClass) {
      return;
    }
    if (optionalPremium instanceof QuoteOptionalPremiumClass) {
      console.log(optionalPremium);
      this.deleteQuoteOptionalPremium(optionalPremium);
    }
  }
  deleteQuoteOptionalPremium(optionalPremium: QuoteOptionalPremiumClass) {
    const index = this.optionalPremiumData?.indexOf(optionalPremium, 0);
    if (index > -1) {
      this.optionalPremiumData?.splice(index, 1);
      // Mark dirty to force form rules check
      this.program?.quoteData?.markDirty();
      if (!optionalPremium.isNew && optionalPremium.propertyQuoteBuildingOptionalCoverageId != null) {
        this.deleteSub = this.quoteService
          .deleteOptionalCoverage(optionalPremium.propertyQuoteBuildingOptionalCoverageId)
          .subscribe((result) => {
            if (result) {
              setTimeout(() => {
                this.notification.show('Optional Coverage deleted.', { classname: 'bg-success text-light', delay: 5000 });
              });
            }
          });
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
    this.collapsed = false;
  }
}

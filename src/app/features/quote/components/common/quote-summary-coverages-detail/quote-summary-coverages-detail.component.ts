import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { of, Subscription, tap } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { LineItemDescription } from 'src/app/features/policy/services/line-item-descriptions-service/line-item-description';
import { LineItemDescriptionsService } from 'src/app/features/policy/services/line-item-descriptions-service/line-item-descriptions.service';
import { DepartmentComponentBase } from 'src/app/shared/component-base/department-component-base';
import { OptionalPremiumMapping } from 'src/app/shared/models/optional-premium-mapping';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
import { QuoteRateClass } from '../../../classes/quote-rate-class';

@Component({
  selector: 'rsps-quote-summary-coverages-detail',
  templateUrl: './quote-summary-coverages-detail.component.html',
  styleUrls: ['./quote-summary-coverages-detail.component.css']
})
export class QuoteSummaryCoveragesDetailComponent extends DepartmentComponentBase implements OnInit {
  @Input() program!: ProgramClass;
  terrorismLabel = 'Terrorism (TRIPRA) Premium:';
  brokerCommissionLabel = 'Broker Commission:';
  rate: QuoteRateClass | null = null;
  effectiveDate!: Date | moment.Moment;
  optionalCoveragesSubscription!: Subscription;
  optionalCoverages!: OptionalPremiumMapping[];
  itemDescriptionSub!: Subscription;
  lineitemDescriptions!: LineItemDescription[];
  quoteData!: PropertyQuoteClass | null;
  constructor(pageDataService: PageDataService, userAuth: UserAuth, private dropdowns: DropDownsService, private lineItemDescriptionsService: LineItemDescriptionsService) {
    super(userAuth);
  }

  ngOnInit(): void {
    this.quoteData = this.program.quoteData instanceof PropertyQuoteClass ? this.program.quoteData : null;
    this.rate = this.quoteData?.quoteRates[0] ?? null;
    this.quoteData?.calculateSummaryPremiums();
    this.effectiveDate = this.program.quoteData?.policyEffectiveDate || moment().startOf('day');
    const effectiveDate = moment.isMoment(this.effectiveDate) ? this.effectiveDate.format('YYYY-MM-DD HH:mm') : this.effectiveDate?.toString();
    this.optionalCoveragesSubscription = this.dropdowns.getPropertyOptionalCoverages(this.program?.programId || 0, effectiveDate).subscribe({
      next: result => {
        this.optionalCoverages = result;
      }
    });
    const myDate:Date = moment(this.effectiveDate).toDate();
    this.itemDescriptionSub = this.lineItemDescriptionsService.getLineItemDescriptions(this.quoteData?.riskState? this.quoteData.riskState: '', myDate).subscribe({
      next: reisuranceCodes => {
        this.lineitemDescriptions = reisuranceCodes;
      }
    });
  }
  ngOnDestroy(): void {
    this.optionalCoveragesSubscription.unsubscribe();
    this.itemDescriptionSub.unsubscribe();
  }

  changeEarnedPremiumPct(percent: number): void {
    percent = Number(percent.toString().replace(/[%]/g, ''));
    if(this.quoteData){
      this.quoteData.earnedPremiumPct = Number(percent/100);
    }
    this.quoteData?.calculateSummaryPremiums();
  }
}

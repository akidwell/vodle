import { Component, OnInit } from '@angular/core';
import { Moment } from 'moment';
import { Subscription } from 'rxjs';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
import { QuoteLineItemClass } from '../../../classes/quote-line-item-class';
import { QuoteRateClass } from '../../../classes/quote-rate-class';

@Component({
  selector: 'rsps-quote-premium',
  templateUrl: './quote-premium.component.html',
  styleUrls: ['./quote-premium.component.css']
})
export class QuotePremiumComponent implements OnInit {
  program!: ProgramClass;
  quote!: PropertyQuoteClass;
  rate!: QuoteRateClass;
  quoteId = 0;
  programSub!: Subscription;
  componentType = SharedComponentType.Policy;
  riskState!: string| null;
  effectiveDate!: Date | Moment | null;
  quoteLineItemData!: QuoteLineItemClass[];

  constructor(private pageDataService: PageDataService) {
  }

  ngOnInit(): void {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        if (selectedProgram != null) {
          this.program = selectedProgram;
          if (selectedProgram.quoteData instanceof PropertyQuoteClass) {
            this.quote = selectedProgram.quoteData ?? new PropertyQuoteClass();
            this.quoteLineItemData = this.quote?.quoteLineItems;
            this.riskState = this.quote?.riskState;
            this.effectiveDate = this.quote?.policyEffectiveDate;
          }
          this.rate = selectedProgram.quoteData?.quoteRates[0] ?? new QuoteRateClass();
        }
      }
    );
  }
}



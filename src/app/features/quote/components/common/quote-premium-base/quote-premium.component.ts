import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
import { QuoteClass } from '../../../classes/quote-class';
import { QuoteRateClass } from '../../../classes/quote-rate-class';

@Component({
  selector: 'rsps-quote-premium',
  templateUrl: './quote-premium.component.html',
  styleUrls: ['./quote-premium.component.css']
})
export class QuotePremiumComponent implements OnInit {
  program!: ProgramClass;
  quote!: QuoteClass;
  rate!: QuoteRateClass;
  quoteId = 0;
  programSub!: Subscription;
  componentType = SharedComponentType.Policy;
  constructor(private pageDataService: PageDataService) {
  }

  ngOnInit(): void {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        if (selectedProgram != null) {
          this.program = selectedProgram;
          this.quote = selectedProgram.quoteData ?? new PropertyQuoteClass();
          this.rate = selectedProgram.quoteData?.quoteRates[0] ?? new QuoteRateClass();
        }
      }
    );
  }
}



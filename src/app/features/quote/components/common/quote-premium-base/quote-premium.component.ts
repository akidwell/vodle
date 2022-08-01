import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
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
  constructor(private pageDataService: PageDataService) {
  }

  ngOnInit(): void {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        if (selectedProgram != null) {
          this.program = selectedProgram;
          this.quote = selectedProgram.quoteData ?? new QuoteClass();
          this.rate = selectedProgram.quoteData?.quoteRates[0] ?? new QuoteRateClass();
        }
      }
    );
  }
}



import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
import { QuoteCoverageClass } from '../../../classes/quote-coverage-class';

@Component({
  selector: 'rsps-quote-premium',
  templateUrl: './quote-premium.component.html',
  styleUrls: ['./quote-premium.component.css']
})
export class QuotePremiumComponent implements OnInit {
  program!: ProgramClass | null;
  quoteId = 0;
  programSub!: Subscription;
  coveragePremium: QuoteCoverageClass = new QuoteCoverageClass();
  constructor(private pageDataService: PageDataService) {
  }

  ngOnInit(): void {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        this.program = selectedProgram;
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
import { QuoteSavingService } from '../../../services/quote-saving-service/quote-saving-service.service';

@Component({
  selector: 'rsps-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {
  programSub!: Subscription;
  quote!: PropertyQuoteClass;
  classType = SharedComponentType.Quote;
  isSaving = false;
  saveSub!: Subscription;
  constructor(private pageDataService: PageDataService, private quoteSavingService: QuoteSavingService) { }

  ngOnInit(): void {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        if (selectedProgram != null) {
          setTimeout(() => {
            this.quote = selectedProgram.quoteData as PropertyQuoteClass ?? new PropertyQuoteClass();
          });
        }
      }
    );
    this.saveSub = this.quoteSavingService.isSaving$.subscribe(
      (isSaving) => (this.isSaving = isSaving)
    );
  }
}

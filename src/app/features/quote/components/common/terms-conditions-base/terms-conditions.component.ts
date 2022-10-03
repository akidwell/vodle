import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';

@Component({
  selector: 'rsps-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {
  programSub!: Subscription;
  quote!: PropertyQuoteClass;
  classType = SharedComponentType.Quote;

  constructor(private pageDataService: PageDataService) { }

  ngOnInit(): void {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        if (selectedProgram != null) {
          setTimeout(() => {
            this.quote = selectedProgram.quoteData as PropertyQuoteClass ?? new PropertyQuoteClass();
            console.log(this.quote);
          });
        }
      }
    );
  }
}

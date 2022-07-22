import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { PropertyQuote } from 'src/app/features/quote/models/property-quote';
import { Quote } from 'src/app/features/quote/models/quote';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';

@Component({
  selector: 'rsps-property-import',
  templateUrl: './property-import.component.html',
  styleUrls: ['./property-import.component.css']
})
export class PropertyImportComponent implements OnInit {
  sequenceNumber = 0;

  @Input() public quote!: Quote;
  @Input() public classType!: ClassTypeEnum;
  @Input() public canEdit = false;

  constructor(private route: ActivatedRoute, private quoteService: QuoteService, private pageDataService: PageDataService) { }

  ngOnInit(): void {
  }

  async import(e: any){
    console.log('Change input file'+ e);
    const seq = this.route.parent?.parent?.snapshot.paramMap.get('seq');
    if (this.quote != null && seq != null) {
      const results$ = this.quoteService.import(Number(seq), e.target.files[0]);
      await lastValueFrom(results$).then((quote) => {
        if (this.pageDataService.selectedProgram != null) {
          this.pageDataService.selectedProgram.quoteData = new QuoteClass(quote);
          this.pageDataService.refreshProgram();
        }
      });
    }
  }

}

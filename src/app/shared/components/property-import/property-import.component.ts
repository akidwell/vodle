import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
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
  @ViewChild('file') myInputVariable!: ElementRef;

  constructor(private route: ActivatedRoute, private quoteService: QuoteService, private pageDataService: PageDataService, private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit(): void {
  }

  async import(e: any){
    console.log('Change input file'+ e);
    const file = e.target.files[0];
    this.myInputVariable.nativeElement.value = '';
    if (file !== null) {
      if (this.classType == ClassTypeEnum.Quote) {
        const quoteId = this.route.parent?.parent?.snapshot.paramMap.get('seq');
        if (this.quote != null && quoteId != null) {
          if (this.quote.propertyQuote.propertyQuoteBuilding.length > 0) {
            this.confirmationDialogService.open('Import Confirmation','Do you wish to overwrite existing buildings & coverages?').then(async (result: boolean) => {
              if (result) {
                await this.importQuote(Number(quoteId),file);
              }
            });
          }
          else {
            await this.importQuote(Number(quoteId),file);
          }
        }
      }
      else if (this.classType == ClassTypeEnum.Policy) {
        //TODO Policy
      }
    }

  }

  async importQuote(quoteId: number, file: File) {
    const results$ = this.quoteService.import(quoteId, file);
    await lastValueFrom(results$).then((quote) => {
      if (this.pageDataService.selectedProgram != null) {
        this.pageDataService.selectedProgram.quoteData = new QuoteClass(quote);
        this.pageDataService.selectedProgram.quoteData.markImported();
        this.pageDataService.refreshProgram();
      }
    });
  }
}

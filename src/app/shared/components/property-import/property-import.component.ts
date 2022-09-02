import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { QuoteClass } from 'src/app/features/quote/classes/quote-class';
import { Quote } from 'src/app/features/quote/models/quote';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';

@Component({
  selector: 'rsps-property-import',
  templateUrl: './property-import.component.html',
  styleUrls: ['./property-import.component.css'],
})
export class PropertyImportComponent {
  sequenceNumber = 0;
  importing = false;

  @Input() public quote!: Quote;
  @Input() public classType!: ClassTypeEnum;
  @Input() public canEdit = false;
  @ViewChild('file') myInputVariable!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private quoteService: QuoteService,
    private pageDataService: PageDataService,
    private confirmationDialogService: ConfirmationDialogService,
    private notification: NotificationService,
    private messageDialog: MessageDialogService
  ) { }

  async import(e: any) {
    const file = e.target.files[0];
    this.myInputVariable.nativeElement.value = '';
    this.quote.classCode = null;
    if (file !== null) {
      if (this.classType == ClassTypeEnum.Quote) {
        const quoteId = this.route.parent?.parent?.snapshot.paramMap.get('seq');
        if (this.quote != null && quoteId != null) {
          if (this.quote.propertyQuote.propertyQuoteBuilding.length > 0) {
            this.confirmationDialogService
              .open(
                'Import Confirmation',
                'Do you wish to overwrite existing buildings & coverages?'
              )
              .then(async (result: boolean) => {
                if (result) {
                  this.quote.propertyQuote.clearBuildings();
                  if (this.quote.propertyQuote.propertyQuoteId !== null) {
                    const result$ = this.quoteService.deleteAllBuildings(this.quote.propertyQuote.propertyQuoteId);
                    await lastValueFrom(result$);
                  }
                  await this.importQuote(this.quote, file);
                }
              });
          } else {
            await this.importQuote(this.quote, file);
          }
        }
      } else if (this.classType == ClassTypeEnum.Policy) {
        //TODO Policy
      }
    }
  }

  async importQuote(quote: Quote, file: File) {
    this.importing = true;
    const results$ = this.quoteService.import(quote, file);
    await lastValueFrom(results$).then(
      async (quote) => {
        const newQuote = new QuoteClass(quote);
        newQuote.markImported();
        if (await this.checkErrors(quote.importErrors)) {
          if (await this.checkWarning(quote.importWarnings)) {
            this.loadQuote(newQuote);
          }
        }
        this.importing = false;
      },
      (error) => {
        this.importing = false;
        this.notification.show('Import Error', error);
      }
    );
  }

  private async checkErrors(errors: string[]): Promise<boolean> {
    if (errors.length > 0 ) {
      let errorsMessage =errors.map(x=>x).join('<br>');
      errorsMessage += '<br><br>Please fix errors and try again';
      return await this.messageDialog
        .open(
          'Import Errors',
          errorsMessage
        )
        .then(() => {
          return false;
        });
    }
    return true;
  }

  private async checkWarning(warnings: string[]): Promise<boolean> {
    if (warnings.length > 0 ) {
      let warningMessage = warnings.map(x=>x).join('<br>');
      warningMessage += '<br><br>Do you still want to import?';
      return await this.confirmationDialogService
        .open(
          'Import Warnings',
          warningMessage
        )
        .then((result) => {
          return result;
        });
    }
    return true;
  }

  private loadQuote(quote: QuoteClass) {
    if (this.pageDataService.selectedProgram != null) {
      this.pageDataService.selectedProgram.quoteData = quote;
      this.pageDataService.refreshProgram();
    }
  }
}

import { sequence } from '@angular/animations';
import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { PolicyService } from 'src/app/features/policy/services/policy/policy.service';
import { DepartmentComponentBase } from 'src/app/shared/component-base/department-component-base';
import { PolicyFormsService } from 'src/app/shared/components/policy-forms/services/policy-forms.service';
import { ProgramClass } from '../../../classes/program-class';
import { QuoteClass } from '../../../classes/quote-class';
import { QuoteSavingService } from '../../../services/quote-saving-service/quote-saving-service.service';
import { QuoteService } from '../../../services/quote-service/quote.service';

@Component({
  selector: 'rsps-quote-summary-quote-bind',
  templateUrl: './quote-summary-quote-bind.component.html',
  styleUrls: ['./quote-summary-quote-bind.component.css']
})
export class QuoteSummaryQuoteBindComponent extends DepartmentComponentBase {
  @Input() program!: ProgramClass;
  quoteExpirationDays = 30;
  quoteExpirationDate!: moment.Moment;
  formatDateForDisplay: FormatDateForDisplay;
  quoteLetterGeneratedDisplay!: string | null;
  quoteLetterExpirationDisplay!: string | null;
  binderLetterGeneratedDisplay!: string | null;
  isBusy = false;
  newPolNum!: string;
  isSaving = false;
  saveSub!: Subscription;
  updatedQuotedata!: QuoteClass | null;

  quoteData!: QuoteClass | null;
  constructor( public pageDataService: PageDataService, userAuth: UserAuth, private formatDate: FormatDateForDisplay, private policyFormsService: PolicyFormsService,
    private messageDialogService: MessageDialogService,
    public headerPaddingService: HeaderPaddingService,
    private quoteService: QuoteService,
    private quoteSavingService: QuoteSavingService) {
    super(userAuth);
    this.formatDateForDisplay = formatDate;
    this.changeQuoteExpirationDate();
  }

  ngOnInit(): void {
    this.quoteData = this.program.quoteData;
    if(this.quoteData) {
      this.quoteLetterGeneratedDisplay = this.formatDateForDisplay.formatDateForDisplay(this.quoteData.printedAt) || '--';
      this.binderLetterGeneratedDisplay = '--';
    } else {
      this.quoteLetterGeneratedDisplay = '--';
    }
    this.saveSub = this.quoteSavingService.isSaving$.subscribe(
      (isSaving) => (this.isSaving = isSaving)
    );
  }
  changeQuoteExpirationDate() {
    this.quoteExpirationDate = moment().startOf('day').add(this.quoteExpirationDays, 'd');
    this.quoteLetterExpirationDisplay = this.formatDateForDisplay.formatDateForDisplay(this.quoteExpirationDate) || '--';
  }

  async generateQuoteLetter() {
    console.log('generate quote letter');
    if(this.quoteData) {
      this.quoteData.printedAt = moment().startOf('day');
      this.quoteLetterGeneratedDisplay = this.formatDateForDisplay.formatDateForDisplay(this.quoteData.printedAt) || '--';
      this.changeQuoteExpirationDate();
      this.isBusy = true;
      await this.updateQuoteStatus();
      const response$ = this.policyFormsService.getQuote(this.quoteData?.quoteId ?? 0);
      await lastValueFrom(response$).then((quoteLetter) => {
        if (quoteLetter) {
          const file = new Blob([quoteLetter], { type: 'application/octet-stream' });
          const element = document.createElement('a');
          element.href = URL.createObjectURL(file);
          element.download = 'QL-' + this.quoteData?.submissionNumber + 'Q' + this.quoteData?.quoteNumber + '.docx';
          document.body.appendChild(element);
          element.click();
          this.isBusy = false;
        }
      })
        .catch((error) => {
          this.isBusy = false;
          const message = String.fromCharCode.apply(null, new Uint8Array(error.error) as any);
          this.messageDialogService.open('Quote Letter Error', message);
        });
    } else {
      this.quoteLetterGeneratedDisplay = '--';
    }
  }
  async generateBinderLetter() {
    this.isBusy = true;
    //await this.updateBinderStatus();
    this.isSaving = true;
    const response$ = this.quoteService.UpdateQuoteAndGetBinderLetter(this.quoteData);
    await lastValueFrom(response$).then((binderLetter) => {
      if (binderLetter) {
        const file = new Blob([binderLetter], { type: 'application/pdf' });
        const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = 'BL-' + this.quoteData?.submissionNumber + 'Q' + this.quoteData?.quoteNumber + '.pdf';
        document.body.appendChild(element);
        element.click();
        this.binderLetterGeneratedDisplay = this.formatDateForDisplay.formatDateForDisplay(moment().startOf('day')) || '--';
      }
    })
      .catch((error) => {
        this.isBusy = false;
        const message = String.fromCharCode.apply(null, new Uint8Array(error.error) as any);
        this.messageDialogService.open('Binder Letter Error', message);
      });
    const updated = this.quoteService.getQuotes(this.quoteData?.sequenceNumber);
    await lastValueFrom(updated).then((x)=> {
      this.updatedQuotedata = x.programMappings[0].quoteData;
    });
    if(this.quoteData?.policyNumber != undefined){
      this.quoteData.policyNumber = this.updatedQuotedata?.policyNumber ?? '';
      this.quoteData.policyMod = this.updatedQuotedata?.policyMod ?? '';
    }
    this.isBusy = false;
    this.isSaving = false;
  }

  async updateQuoteStatus () {
    if(this.quoteData){
      this.quoteData.status = 3;
      this.quoteData.quoteExpirationDate = this.quoteExpirationDate.toDate();
    }
    await this.quoteSavingService.saveQuote();
  }

  // async updateBinderStatus () {
  //   if(this.quoteData) {
  //     this.quoteData.status = 7;
  //   }
  //   //check if renewal
  //   //TODO: renewal logic
  //   if(this.quoteData?.submission.newRenewalFlag == 2){
  //     //
  //   } else if(this.quoteData) {
  //     //only call the policy number service once
  //     const string = this.quoteData.policyNumber.toString().replace(/-/g, '');
  //     if(string == ''){
  //       const policyNumber = this.quoteService.getPolicyNumber();
  //       await lastValueFrom(policyNumber).then((polNum) => {
  //         if (polNum) {
  //           if (this.quoteData?.policyNumber != undefined){
  //             this.quoteData.policyNumber = polNum;
  //             this.quoteData.policyMod = '00';
  //           }
  //         }
  //       });
  //     }
  //   }
  //   await this.quoteSavingService.saveQuote();
  //}
}


import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { DepartmentComponentBase } from 'src/app/shared/component-base/department-component-base';
import { ProgramClass } from '../../../classes/program-class';
import { QuoteClass } from '../../../classes/quote-class';

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


  quoteData!: QuoteClass | null;
  constructor(pageDataService: PageDataService, userAuth: UserAuth, private formatDate: FormatDateForDisplay) {
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
  }
  changeQuoteExpirationDate() {
    this.quoteExpirationDate = moment().startOf('day').add(this.quoteExpirationDays, 'd');
    this.quoteLetterExpirationDisplay = this.formatDateForDisplay.formatDateForDisplay(this.quoteExpirationDate) || '--';
  }
  generateQuoteLetter() {
    console.log('generate quote letter');
    if(this.quoteData) {
      this.quoteData.printedAt = moment().startOf('day');
      this.quoteLetterGeneratedDisplay = this.formatDateForDisplay.formatDateForDisplay(this.quoteData.printedAt) || '--';
      this.changeQuoteExpirationDate();
    } else {
      this.quoteLetterGeneratedDisplay = '--';
    }
  }
  generateBinderLetter() {
    console.log('generate binder letter');
    this.binderLetterGeneratedDisplay = this.formatDateForDisplay.formatDateForDisplay(moment().startOf('day')) || '--';

  }
}

import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { UserAuth } from 'src/app/core/authorization/user-auth';
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
  quoteData!: QuoteClass | null;
  constructor(pageDataService: PageDataService, userAuth: UserAuth) {
    super(userAuth);
    this.changeQuoteExpirationDate();
  }

  ngOnInit(): void {
    this.quoteData = this.program.quoteData;
  }
  changeQuoteExpirationDate() {
    this.quoteExpirationDate = moment().startOf('day').add(this.quoteExpirationDays, 'd');
  }
  generateQuoteLetter() {
    console.log('generate quote letter');
  }
  generateBinderLetter() {
    console.log('generate binder letter');
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { DepartmentComponentBase } from 'src/app/shared/component-base/department-component-base';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';

@Component({
  selector: 'rsps-quote-summary-coverages-detail',
  templateUrl: './quote-summary-coverages-detail.component.html',
  styleUrls: ['./quote-summary-coverages-detail.component.css']
})
export class QuoteSummaryCoveragesDetailComponent extends DepartmentComponentBase implements OnInit {
  @Input() program!: ProgramClass;
  terrorismLabel = 'Terrorism (TRIPRA) Premium:';
  brokerCommissionLabel = 'Broker Commission:';
  quoteData!: PropertyQuoteClass | null;
  constructor(pageDataService: PageDataService, userAuth: UserAuth) {
    super(userAuth);

  }

  ngOnInit(): void {
    this.quoteData = this.program.quoteData instanceof PropertyQuoteClass ? this.program.quoteData : null;
    this.quoteData?.calculateSummaryPremiums();
  }

}

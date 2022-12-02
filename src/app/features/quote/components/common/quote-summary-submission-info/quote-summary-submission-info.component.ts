import { Component, Input, OnInit } from '@angular/core';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { SubmissionClass } from 'src/app/features/submission/classes/submission-class';
import { DepartmentComponentBase } from 'src/app/shared/component-base/department-component-base';
import { QuoteClass } from '../../../classes/quote-class';

@Component({
  selector: 'rsps-quote-summary-submission-info',
  templateUrl: './quote-summary-submission-info.component.html',
  styleUrls: ['./quote-summary-submission-info.component.css']
})
export class QuoteSummarySubmissionInfoComponent extends DepartmentComponentBase implements OnInit {
  submission!: SubmissionClass;
  @Input() quote!: QuoteClass;
  status!: string;

  constructor(pageDataService: PageDataService, userAuth: UserAuth) {
    super(userAuth);
  }
  ngOnInit(): void {
    this.submission = this.quote.submission;
  }

  getSubmissionStatus(): string{
    switch(this.submission.statusCode){
    case 0:
      return 'Live';
    case 1:
      return 'Dead';
    case 2:
      return 'In Quote';
    case 8:
      return 'Bound';
    default:
      return '';
    }
  }

}

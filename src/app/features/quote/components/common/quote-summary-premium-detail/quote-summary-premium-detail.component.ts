import { Component, OnInit } from '@angular/core';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { DepartmentComponentBase } from 'src/app/shared/component-base/department-component-base';

@Component({
  selector: 'rsps-quote-summary-premium-detail',
  templateUrl: './quote-summary-premium-detail.component.html',
  styleUrls: ['./quote-summary-premium-detail.component.css']
})
export class QuoteSummaryPremiumDetailComponent extends DepartmentComponentBase {

  constructor(pageDataService: PageDataService, userAuth: UserAuth) {
    super(userAuth);
  }
  ngOnInit(): void {
    //this.pageDataService.selectedProgram = null;
  }

}

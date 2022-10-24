import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { DepartmentComponentBase } from 'src/app/shared/component-base/department-component-base';
import { DepartmentClass } from '../../../classes/department-class';

@Component({
  selector: 'rsps-quote-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent extends DepartmentComponentBase {
  department: DepartmentClass | null = null;
  departmentSub!: Subscription;

  constructor(private pageDataService: PageDataService, userAuth: UserAuth) {
    super(userAuth);
    this.departmentSub = pageDataService.quoteData$.subscribe(
      (department: DepartmentClass | null) => {
        this.department = department;
      }
    );
  }

  ngOnInit(): void {
    //this.pageDataService.selectedProgram = null;
  }

}

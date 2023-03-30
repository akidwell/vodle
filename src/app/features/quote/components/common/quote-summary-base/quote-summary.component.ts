import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { DepartmentComponentBase } from 'src/app/shared/component-base/department-component-base';
import { DepartmentClass } from '../../../classes/department-class';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
import { QuoteSavingService } from '../../../services/quote-saving-service/quote-saving-service.service';

@Component({
  selector: 'rsps-quote-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent extends DepartmentComponentBase {
  department: DepartmentClass | null = null;
  departmentSub!: Subscription;
  programSub!: Subscription;
  quote!: PropertyQuoteClass;
  classType = SharedComponentType.Quote;
  isSaving = false;
  saveSub!: Subscription;
  @Input() isBusy = false;


  constructor(private pageDataService: PageDataService, userAuth: UserAuth, private quoteSavingService: QuoteSavingService) {
    super(userAuth);
    this.departmentSub = pageDataService.quoteData$.subscribe(
      (department: DepartmentClass | null) => {
        this.department = department;
      }
    );
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        if (selectedProgram != null) {
          setTimeout(() => {
            this.quote = selectedProgram.quoteData as PropertyQuoteClass ?? new PropertyQuoteClass();
          });
        }
      }
    );
  }


  ngOnInit(): void {
    this.saveSub = this.quoteSavingService.isSaving$.subscribe(
      (isSaving) => (this.isSaving = isSaving)
    );
  }
}

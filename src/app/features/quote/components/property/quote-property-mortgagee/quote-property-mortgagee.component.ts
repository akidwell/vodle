import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
import { QuoteClass } from '../../../classes/quote-class';

@Component({
  selector: 'rsps-quote-property-mortgagee',
  templateUrl: './quote-property-mortgagee.component.html',
  styleUrls: ['./quote-property-mortgagee.component.css']
})
export class QuotePropertyMortgageeComponent{

  authSub: Subscription;
  canEditSubmission = false;
  quote!: QuoteClass;
  programSub!: Subscription;
  classType = ClassTypeEnum.Quote;

  constructor(private userAuth: UserAuth, private pageDataService: PageDataService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }

  ngAfterViewInit(): void {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        if (selectedProgram != null) {
          this.quote = selectedProgram.quoteData ?? new QuoteClass();
        }
      }
    );
  }

}

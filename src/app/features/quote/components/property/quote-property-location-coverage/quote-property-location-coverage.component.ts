import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';

@Component({
  selector: 'rsps-quote-property-location-coverage',
  templateUrl: './quote-property-location-coverage.component.html',
  styleUrls: ['./quote-property-location-coverage.component.css']
})
export class QuotePropertyLocationCoverageComponent {
  authSub: Subscription;
  canEditSubmission = false;
  quote!: PropertyQuoteClass;
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
          setTimeout(() => {
            this.quote = selectedProgram.quoteData as PropertyQuoteClass ?? new PropertyQuoteClass();
          });
        }
      }
    );
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.programSub?.unsubscribe();
  }

}

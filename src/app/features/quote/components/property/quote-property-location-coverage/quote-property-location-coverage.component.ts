import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
import { QuoteClass } from '../../../classes/quote-class';
import { QuoteDataValidationService } from '../../../services/quote-data-validation-service/quote-data-validation-service.service';

@Component({
  selector: 'rsps-quote-property-location-coverage',
  templateUrl: './quote-property-location-coverage.component.html',
  styleUrls: ['./quote-property-location-coverage.component.css']
})
export class QuotePropertyLocationCoverageComponent {
  authSub: Subscription;
  canEditSubmission = false;
  quote!: QuoteClass;
  programSub!: Subscription;
  // tabValidationSub!: Subscription;
  classType = ClassTypeEnum.Quote;

  constructor(private userAuth: UserAuth, private pageDataService: PageDataService, private quoteValidationService: QuoteDataValidationService) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
  }

  ngAfterViewInit(): void {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        if (selectedProgram != null) {
          setTimeout(() => {
            this.quote = selectedProgram.quoteData ?? new QuoteClass();
            this.quoteValidationService.propertyQuoteLocationBuildingTabValidation = this.quote.propertyQuote.propertyQuoteBuildingLocationTabValidation;
            this.quoteValidationService.propertyQuoteMortgageeAdditionalInterestTabValidation = this.quote.propertyQuote.propertyQuoteMortgageeAdditionalInterestTabValidation;
          });
        }
      }
    );
    // this.tabValidationSub = this.quoteValidationService.propertyQuoteLocationBuildingTabValidation$.subscribe(
    //   (validation: QuoteValidationClass | null) => {
    //   }
    // );
  }


}

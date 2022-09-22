import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../classes/program-class';
import { PropertyQuoteClass } from '../../classes/property-quote-class';
import { QuoteValidationClass } from '../../classes/quote-validation-class';
import { QuoteDataValidationService } from '../../services/quote-data-validation-service/quote-data-validation-service.service';

@Component({
  selector: 'rsps-quote-program-base',
  templateUrl: './quote-program-base.component.html',
  styleUrls: ['./quote-program-base.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class QuoteProgramBaseComponent {
  program!: ProgramClass | null;
  quoteId = 0;
  programSub!: Subscription;
  propertyLocationTabValidationSub!: Subscription;
  propertyLocationTabValidation: QuoteValidationClass | null = null;

  mortgageeAdditionalInterestTabValidationSub!: Subscription;
  mortgageeAdditionalInterestTabValidation: QuoteValidationClass | null = null;

  coveragePremiumTabValidationSub!: Subscription;
  coveragePremiumTabValidation: QuoteValidationClass | null = null;

  formsListTabValidationSub!: Subscription;
  formsListTabValidation: QuoteValidationClass | null = null;

  termsAndConditionsTabValidationSub!: Subscription;
  termsAndConditionsTabValidation: QuoteValidationClass | null = null;

  constructor(private pageDataService: PageDataService, private route: ActivatedRoute, private quoteValidationService: QuoteDataValidationService) {
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(routeParams => {
      this.pageDataService.getProgramWithQuote(routeParams.quoteId);
    });
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        setTimeout(() => {
          this.program = selectedProgram;
          if (this.program?.quoteData instanceof PropertyQuoteClass) {
            this.quoteValidationService.propertyQuoteLocationBuildingTabValidation = this.program?.quoteData?.propertyQuoteBuildingLocationTabValidation || null;
            this.mortgageeAdditionalInterestTabValidation = this.program?.quoteData?.propertyQuoteMortgageeAdditionalInterestTabValidation || null;
            this.coveragePremiumTabValidation = this.program?.quoteData?.coveragesTabValidation || null;
            this.formsListTabValidation = this.program?.quoteData?.formsListTabValidation || null;
            this.termsAndConditionsTabValidation = this.program?.quoteData?.termsAndConditionsTabValidation || null;
          }
        });
      }
    );
    this.propertyLocationTabValidationSub = this.quoteValidationService.propertyQuoteLocationBuildingTabValidation$.subscribe(
      (validation: QuoteValidationClass | null) => {
        setTimeout(() => {
          this.propertyLocationTabValidation = validation;
        });
      }
    );
    this.mortgageeAdditionalInterestTabValidationSub = this.quoteValidationService.propertyQuoteMortgageeAdditionalInterestTabValidation$.subscribe(
      (validation: QuoteValidationClass | null) => {
        setTimeout(() => {
          this.mortgageeAdditionalInterestTabValidation = validation;
        });
      }
    );
    this.coveragePremiumTabValidationSub = this.quoteValidationService.coveragePremiumTabValidation$.subscribe(
      (validation: QuoteValidationClass | null) => {
        setTimeout(() => {
          this.coveragePremiumTabValidation = validation;
        });
      }
    );
    this.formsListTabValidationSub = this.quoteValidationService.formsListTabValidation$.subscribe(
      (validation: QuoteValidationClass | null) => {
        setTimeout(() => {
          this.formsListTabValidation = validation;
        });
      }
    );
    this.termsAndConditionsTabValidationSub = this.quoteValidationService.termsAndConditionsTabValidation$.subscribe(
      (validation: QuoteValidationClass | null) => {
        setTimeout(() => {
          this.termsAndConditionsTabValidation = validation;
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.propertyLocationTabValidationSub.unsubscribe();
    this.mortgageeAdditionalInterestTabValidationSub.unsubscribe();
    this.coveragePremiumTabValidationSub.unsubscribe();
    this.formsListTabValidationSub.unsubscribe();
    this.termsAndConditionsTabValidationSub.unsubscribe();
  }
}

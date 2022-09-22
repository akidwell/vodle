import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { DepartmentClass } from '../../classes/department-class';
import { PropertyQuoteClass } from '../../classes/property-quote-class';
import { QuoteClass } from '../../classes/quote-class';
import { QuoteValidationClass } from '../../classes/quote-validation-class';

@Injectable()
export class QuoteDataValidationService {
  private department!: DepartmentClass | null;
  private departmentSub: Subscription;
  private quoteValidations: QuoteValidationClass[] = [];

  private _propertyQuoteValidation: QuoteValidationClass | null = null;
  private _propertyQuoteLocationBuildingTabValidation: QuoteValidationClass | null = null;
  private _propertyQuoteMortgageeAdditionalInterestTabValidation: QuoteValidationClass | null = null;
  private _coveragePremiumTabValidation: QuoteValidationClass | null = null;
  private _formsListTabValidation: QuoteValidationClass | null = null;
  private _termsAndConditionsTabValidation: QuoteValidationClass | null = null;

  propertyQuoteValidation$: BehaviorSubject<QuoteValidationClass | null> = new BehaviorSubject(this.propertyQuoteValidation);
  propertyQuoteLocationBuildingTabValidation$: BehaviorSubject<QuoteValidationClass | null> = new BehaviorSubject(this.propertyQuoteLocationBuildingTabValidation);
  propertyQuoteMortgageeAdditionalInterestTabValidation$: BehaviorSubject<QuoteValidationClass | null> = new BehaviorSubject(this.propertyQuoteMortgageeAdditionalInterestTabValidation);
  coveragePremiumTabValidation$: BehaviorSubject<QuoteValidationClass | null> = new BehaviorSubject(this.coveragePremiumTabValidation);
  formsListTabValidation$: BehaviorSubject<QuoteValidationClass | null> = new BehaviorSubject(this.formsListTabValidation);
  termsAndConditionsTabValidation$: BehaviorSubject<QuoteValidationClass | null> = new BehaviorSubject(this.termsAndConditionsTabValidation);

  constructor(private pageDataService: PageDataService) {
    this.departmentSub = this.pageDataService.quoteData$.subscribe(
      (department: DepartmentClass | null) => {
        this.department = department;
      }
    );
  }
  get propertyQuoteValidation(): QuoteValidationClass | null {
    return this._propertyQuoteValidation;
  }
  set propertyQuoteValidation(validation: QuoteValidationClass | null) {
    this._propertyQuoteValidation = validation;
    this.propertyQuoteValidation$.next(this._propertyQuoteValidation);
  }
  get propertyQuoteMortgageeAdditionalInterestTabValidation(): QuoteValidationClass | null {
    return this._propertyQuoteMortgageeAdditionalInterestTabValidation;
  }
  set propertyQuoteMortgageeAdditionalInterestTabValidation(validation: QuoteValidationClass | null) {
    this._propertyQuoteMortgageeAdditionalInterestTabValidation = validation;
    this.propertyQuoteMortgageeAdditionalInterestTabValidation$.next(this._propertyQuoteMortgageeAdditionalInterestTabValidation);
  }
  get coveragePremiumTabValidation(): QuoteValidationClass | null {
    return this._coveragePremiumTabValidation;
  }
  set coveragePremiumTabValidation(validation: QuoteValidationClass | null) {
    this._coveragePremiumTabValidation = validation;
    this.coveragePremiumTabValidation$.next(this._coveragePremiumTabValidation);
  }
  get formsListTabValidation(): QuoteValidationClass | null {
    return this._formsListTabValidation;
  }
  set formsListTabValidation(validation: QuoteValidationClass | null) {
    this._formsListTabValidation = validation;
    this.formsListTabValidation$.next(this._formsListTabValidation);
  }
  get termsAndConditionsTabValidation(): QuoteValidationClass | null {
    return this._termsAndConditionsTabValidation;
  }
  set termsAndConditionsTabValidation(validation: QuoteValidationClass | null) {
    this._termsAndConditionsTabValidation = validation;
    this.termsAndConditionsTabValidation$.next(this._termsAndConditionsTabValidation);
  }
  get propertyQuoteLocationBuildingTabValidation(): QuoteValidationClass | null {
    return this._propertyQuoteLocationBuildingTabValidation;
  }
  set propertyQuoteLocationBuildingTabValidation(validation: QuoteValidationClass | null) {
    this._propertyQuoteLocationBuildingTabValidation = validation;
    this.propertyQuoteLocationBuildingTabValidation$.next(this._propertyQuoteLocationBuildingTabValidation);
  }
  // get propertyQuoteBuildingValidation(): QuoteValidation | null {
  //   return this._propertyQuoteBuildingValidation;
  // }
  // set propertyQuoteBuildingValidation(validation: QuoteValidation | null) {
  //   this._propertyQuoteBuildingValidation = validation;
  // }
  validateSingleQuote(quoteId: number) {
    const quote = this.department?.programMappings.find(x => x.quoteData?.quoteId == quoteId)?.quoteData;
    if (!quote) {
      return; //TODO: Need to throw error
    } else {
      quote.validateQuote();
      this.updateQuoteValidations(quote);
    }
  }
  //probably not needed
  // validateSingleTab(quoteId: number, tabName: QuoteValidationTabNameEnum) {
  //   const quote = this.department?.programMappings.find(x => x.quoteData?.quoteId == quoteId)?.quoteData;
  //   if (!quote) {
  //     return; //TODO: Need to throw error
  //   } else {
  //     //quote.validateQuote();
  //   }
  // }
  updateQuoteValidations(quote: QuoteClass | null) {
    if (quote) {
      if (quote instanceof PropertyQuoteClass) {
        this.propertyQuoteValidation = quote.validationResults;
        this.propertyQuoteMortgageeAdditionalInterestTabValidation = quote.propertyQuoteMortgageeAdditionalInterestTabValidation;
        this.propertyQuoteLocationBuildingTabValidation = quote.propertyQuoteBuildingLocationTabValidation;
        this.coveragePremiumTabValidation = quote.coveragesTabValidation;
        this.formsListTabValidation = quote.formsListTabValidation;
      }
    }
  }
}

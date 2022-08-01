import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { QuoteValidationTabNameEnum } from 'src/app/core/enums/quote-validation-tab-name-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { DepartmentClass } from '../../classes/department-class';
import { QuoteValidationClass } from '../../classes/quote-validation-class';

@Injectable()
export class QuoteDataValidationService {
  private department!: DepartmentClass | null;
  private departmentSub: Subscription;
  private quoteValidations: QuoteValidationClass[] = [];

  private _propertyQuoteValidation: QuoteValidationClass | null = null;

  propertyQuoteValidation$: BehaviorSubject<QuoteValidationClass | null> = new BehaviorSubject(this.propertyQuoteValidation);
  //propertyQuoteBuildingValidation$: BehaviorSubject<QuoteValidation | null> = new BehaviorSubject(this.propertyQuoteBuildingValidation);
  constructor(private pageDataService: PageDataService) {
    this.departmentSub = this.pageDataService.quoteData$.subscribe(
      (department: DepartmentClass | null) => {
        console.log(department);
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
      this.propertyQuoteValidation = quote.propertyQuote.validationResults;
    }
  }
  //probably not needed
  validateSingleTab(quoteId: number, tabName: QuoteValidationTabNameEnum) {
    const quote = this.department?.programMappings.find(x => x.quoteData?.quoteId == quoteId)?.quoteData;
    if (!quote) {
      return; //TODO: Need to throw error
    } else {
      //quote.validateQuote();
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { DepartmentClass } from '../../classes/department-class';
import { ProgramClass } from '../../classes/program-class';
import { QuoteClass } from '../../classes/quote-class';
import { QuoteChildValidation } from '../../models/quote-child-validation';

@Injectable()
export class QuoteDataValidationService {
  private department!: DepartmentClass | null;
  private departmentSub: Subscription;
  private departmentValidations: QuoteChildValidation[] = [];
  private _propertyQuoteValidation: QuoteChildValidation | null = null;
  private _propertyQuoteBuildingValidation: QuoteChildValidation | null = null;
  isQuoteValid = false;
  isQuoteDirty = false;
  canQuoteBeSaved = false;
  propertyQuoteValidation$: BehaviorSubject<QuoteChildValidation | null> = new BehaviorSubject(this.propertyQuoteValidation);
  propertyQuoteBuildingValidation$: BehaviorSubject<QuoteChildValidation | null> = new BehaviorSubject(this.propertyQuoteBuildingValidation);
  constructor(private pageDataService: PageDataService) {
    this.departmentSub = this.pageDataService.quoteData$.subscribe(
      (department: DepartmentClass | null) => {
        console.log(department);
        this.department = department;
      }
    );
  }

  get propertyQuoteValidation(): QuoteChildValidation | null {
    return this._propertyQuoteValidation;
  }
  set propertyQuoteValidation(validation: QuoteChildValidation | null) {
    this._propertyQuoteValidation = validation;
  }
  get propertyQuoteBuildingValidation(): QuoteChildValidation | null {
    return this._propertyQuoteBuildingValidation;
  }
  set propertyQuoteBuildingValidation(validation: QuoteChildValidation | null) {
    this._propertyQuoteBuildingValidation = validation;
  }
  departmentLevelValidations() {
    this.departmentValidations = [];
    this.department?.programMappings.forEach(program => {
      if (program.quoteData != null){
        this.programLevelValidations(program);
      }
    });
    if (this.propertyQuoteValidation != null) {
      this.departmentValidations.push(this.propertyQuoteValidation);
    }
    if (this.propertyQuoteBuildingValidation != null) {
      this.departmentValidations.push(this.propertyQuoteBuildingValidation);
    }
  }
  programLevelValidations(program: ProgramClass) {
    let quoteData: QuoteClass;
    if (program.quoteData != null) {
      quoteData = program.quoteData;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { PreviousRouteService } from 'src/app/core/services/previous-route/previous-route.service';
import { Department } from '../../../models/department';
import { QuoteSavingService } from '../../../services/quote-saving-service/quote-saving-service.service';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { QuoteValidationClass } from '../../../classes/quote-validation-class';
import { QuoteDataValidationService } from '../../../services/quote-data-validation-service/quote-data-validation-service.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
import { DepartmentClass } from '../../../classes/department-class';

@Component({
  selector: 'rsps-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['../../../../../app.component.css', './quote.component.css']
})
export class QuoteComponent implements OnInit {
  prevSub!: Subscription;
  previousUrl = '';
  previousLabel = 'Previous';
  department!: DepartmentClass;
  isSaving = false;
  saveSub!: Subscription;
  faSave = faSave;
  productSelectionTabValidationSub!: Subscription;
  productSelectionTabValidation: QuoteValidationClass | null = null;
  programSub!: Subscription;

  constructor(public headerPaddingService: HeaderPaddingService,private route: ActivatedRoute, private previousRouteService: PreviousRouteService, private quoteSavingService: QuoteSavingService, private quoteValidationService: QuoteDataValidationService, private pageDataService: PageDataService) {
  }

  ngOnInit(): void {
    this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
      this.previousLabel = this.previousRouteService.getPreviousUrlFormatted();
    });
    this.route?.data.subscribe(data => {
      this.department = data['quoteData'].department;
      this.productSelectionTabValidation = this.department.productSelectionTabValidation;
    });
    this.saveSub = this.quoteSavingService.isSaving$.subscribe(isSaving => this.isSaving = isSaving);
  }

  ngOnDestroy() {
    this.prevSub?.unsubscribe();
    this.saveSub?.unsubscribe();
  }
}

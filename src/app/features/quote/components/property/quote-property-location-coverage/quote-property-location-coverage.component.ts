import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { ClassTypeEnum } from 'src/app/core/enums/class-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
import { QuoteSavingService } from '../../../services/quote-saving-service/quote-saving-service.service';

@Component({
  selector: 'rsps-quote-property-location-coverage',
  templateUrl: './quote-property-location-coverage.component.html',
  styleUrls: ['./quote-property-location-coverage.component.css']
})
export class QuotePropertyLocationCoverageComponent implements OnInit{
  authSub: Subscription;
  canEdit = false;
  quote!: PropertyQuoteClass;
  programSub!: Subscription;
  classType = ClassTypeEnum.Quote;
  isSaving = false;
  saveSub!: Subscription;
  @Input() public readOnlyQuote!: boolean;

  constructor(private userAuth: UserAuth, private pageDataService: PageDataService, private quoteSavingService: QuoteSavingService) {
    this.authSub = this.userAuth.canEditQuote$.subscribe(
      (canEditQuote: boolean) => this.canEdit = canEditQuote
    );
  }

  ngOnInit(): void {
    this.saveSub = this.quoteSavingService.isSaving$.subscribe(
      (isSaving) => (this.isSaving = isSaving)
    );
  }

  ngAfterViewInit(): void {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        if (selectedProgram != null) {
          setTimeout(() => {
            this.readOnlyQuote = selectedProgram.quoteData?.readOnlyQuote ?? false;
            this.quote = selectedProgram.quoteData as PropertyQuoteClass ?? new PropertyQuoteClass();
          });
        }
      }
    );
    this.saveSub = this.quoteSavingService.isSaving$.subscribe(
      (isSaving) => (this.isSaving = isSaving)
    );
  }

  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.programSub?.unsubscribe();
  }

}

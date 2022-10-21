import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SharedComponentType } from 'src/app/core/enums/shared-component-type-enum';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';
import { PropertyQuoteClass } from 'src/app/features/quote/classes/property-quote-class';
import { ComponentBase } from './component-base';

@Component({
  template: ''
})
export abstract class QuoteComponentBase extends ComponentBase implements OnInit,OnDestroy {
  submissionAuthSub: Subscription;
  program!: ProgramClass;
  quote!: PropertyQuoteClass;
  programSub!: Subscription;

  private _type!: SharedComponentType;

  constructor(private userAuth: UserAuth, private pageDataService: PageDataService) {
    super();
    this.submissionAuthSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => {
        this.canEdit = canEditSubmission;
      }
    );
  }
  ngOnInit() {
    this.programSub = this.pageDataService.selectedProgram$.subscribe(
      (selectedProgram: ProgramClass | null) => {
        if (selectedProgram != null) {
          this.program = selectedProgram;
          if (selectedProgram.quoteData instanceof PropertyQuoteClass) {
            this.quote = selectedProgram.quoteData ?? new PropertyQuoteClass();
          }
        }
      }
    );
  }
  ngOnDestroy() {
    this.submissionAuthSub?.unsubscribe();
  }
}

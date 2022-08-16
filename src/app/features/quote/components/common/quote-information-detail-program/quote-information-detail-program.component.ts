import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { HistoryService } from 'src/app/core/services/policy-history/policy-history.service';
import { SubmissionClass } from 'src/app/features/submission/classes/SubmissionClass';
import { ProgramClass } from '../../../classes/program-class';
import { QuoteClass } from '../../../classes/quote-class';
import { QuoteSavingService } from '../../../services/quote-saving-service/quote-saving-service.service';
import { QuoteService } from '../../../services/quote-service/quote.service';

@Component({
  selector: 'rsps-quote-information-detail-program',
  templateUrl: './quote-information-detail-program.component.html',
  styleUrls: ['./quote-information-detail-program.component.css'],
})
export class QuoteInformationDetailProgramComponent {
  formatDateForDisplay!: FormatDateForDisplay;
  authSub: Subscription;
  canEditSubmission = false;
  newQuote = false;
  @Input() public program!: ProgramClass;
  @Input() public submissionForQuote!: SubmissionClass | null;

  constructor(
    private formatDateService: FormatDateForDisplay,
    private userAuth: UserAuth,
    private quoteService: QuoteService,
    private router: Router,
    private historyService: HistoryService,
    private quoteSavingService: QuoteSavingService
  ) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => (this.canEditSubmission = canEditSubmission)
    );
    this.formatDateForDisplay = formatDateService;
  }

  createQuote() {
    this.program.quoteData = new QuoteClass(
      undefined,
      this.program,
      this.submissionForQuote || undefined
    );
    console.log(this.program);
    this.newQuote = true;
    this.quoteSavingService.saveDepartment();
  }

}

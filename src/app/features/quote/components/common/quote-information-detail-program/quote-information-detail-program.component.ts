import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { SubmissionClass } from 'src/app/features/submission/classes/submission-class';
import { ProgramClass } from '../../../classes/program-class';
import { PropertyQuoteClass } from '../../../classes/property-quote-class';
import { QuoteSavingService } from '../../../services/quote-saving-service/quote-saving-service.service';

@Component({
  selector: 'rsps-quote-information-detail-program',
  templateUrl: './quote-information-detail-program.component.html',
  styleUrls: ['./quote-information-detail-program.component.css'],
})
export class QuoteInformationDetailProgramComponent {
  formatDateForDisplay!: FormatDateForDisplay;
  authSub: Subscription;
  canEdit = false;
  newQuote = false;
  showWarnings = false;
  @Input() public program!: ProgramClass;
  @Input() public submissionForQuote!: SubmissionClass | null;

  constructor(
    private formatDateService: FormatDateForDisplay,
    private userAuth: UserAuth,
    private quoteSavingService: QuoteSavingService,
    private messageDialogService: MessageDialogService
  ) {
    this.authSub = this.userAuth.canEditQuote$.subscribe(
      (canEditQuote: boolean) => (this.canEdit = canEditQuote)
    );
    this.formatDateForDisplay = this.formatDateService;
  }

  createQuote() {
    //TODO: CASUALTY create quote
    this.program.quoteData = this.createPropertyQuote();
    this.newQuote = true;
    this.quoteSavingService.saveDepartment();
  }
  createPropertyQuote(): PropertyQuoteClass{
    return new PropertyQuoteClass(
      undefined,
      this.program,
      this.submissionForQuote || undefined
    );
  }

  effectiveDateChange() {
    this.messageDialogService.open('Warning','Changing Effective Date could affect forms');
  }

  hideWarnings(): void {
    this.showWarnings = false;
  }
}

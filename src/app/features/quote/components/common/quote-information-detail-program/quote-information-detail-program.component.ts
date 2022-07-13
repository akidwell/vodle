import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { ProgramClass } from '../../../classes/program-class';

@Component({
  selector: 'rsps-quote-information-detail-program',
  templateUrl: './quote-information-detail-program.component.html',
  styleUrls: ['./quote-information-detail-program.component.css']
})
export class QuoteInformationDetailProgramComponent implements OnInit {
  formatDateForDisplay!: FormatDateForDisplay;
  authSub: Subscription;
  canEditSubmission = false;
  @Input() public program!: ProgramClass;
  constructor(private formatDateService: FormatDateForDisplay, private userAuth: UserAuth) {
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
    this.formatDateForDisplay = formatDateService;
  }

  ngOnInit(): void {
    console.log('test');
  }

}



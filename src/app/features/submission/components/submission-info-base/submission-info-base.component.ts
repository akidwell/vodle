import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { SubmissionClass } from '../../classes/SubmissionClass';

@Component({
  selector: 'rsps-submission-info-base',
  templateUrl: './submission-info-base.component.html',
  styleUrls: ['./submission-info-base.component.css']
})
export class SubmissionInfoBaseComponent implements OnInit {
  submission!: SubmissionClass;
  canEditSubmission = false;
  authSub: Subscription;
  formatDateForDisplay: FormatDateForDisplay;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  qaCollapsed = false;
  seCollapsed = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userAuth: UserAuth,
    public formatDateService: FormatDateForDisplay,
    public pageDataService: PageDataService,
    private navigationService: NavigationService
  ) {
    this.formatDateForDisplay = formatDateService;
    this.authSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => (this.canEditSubmission = canEditSubmission)
    );
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe((data) => {
      if (data['submissionData'] && data['submissionData'].submission) {
        this.submission = data['submissionData'].submission;
      }
      console.log(this.submission);
    });
    this.qaCollapsed = this.submission.quoteActivity.length == 0 ? true : false;

    let group = 0;
    let prevSeq = null;
    let strClass = '';
    for (const x of this.submission.quoteActivity) {
      const currentSeq = x.sequenceNumber;
      if (x.sequenceNumber != group) {
        x.firstRow = true;
        group = x.sequenceNumber;
      }
      x.rowcolor = strClass;
      if(currentSeq != prevSeq){
        switch (strClass) {
        case 'white':
          x.rowcolor = 'gray';
          strClass = 'gray';
          break;
        case 'gray':
          x.rowcolor = 'white';
          strClass = 'white';
          break;
        default:
          x.rowcolor = 'white';
          strClass = 'white';
          break;
        }
      }
      prevSeq = currentSeq;
    }
  }
  routeToQuote(sequenceNumber: number) {
    this.navigationService.resetPolicy();
    this.router.navigate(['/quote/' + sequenceNumber.toString() + '/information']);
  }
}

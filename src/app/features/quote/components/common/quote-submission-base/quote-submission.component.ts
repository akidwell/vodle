import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PreviousRouteService } from 'src/app/core/services/previous-route/previous-route.service';
import { DepartmentClass } from '../../../classes/department-class';

@Component({
  selector: 'rsps-quote-submission',
  templateUrl: './quote-submission.component.html',
  styleUrls: ['./quote-submission.component.css']
})
export class QuoteSubmissionComponent implements OnInit {
  department!: DepartmentClass;
  submissionCollapsed = false;
  quoteInfoCollapsed = false;
  formatDateForDisplay!: FormatDateForDisplay;
  invalidList = [];
  authSub: Subscription;
  canEditSubmission = false;
  showInvalid = false;
  invalidMessage = '';
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  constructor(private route: ActivatedRoute, private router: Router, private formatDateService: FormatDateForDisplay,
    private userAuth: UserAuth, private messageDialogService: MessageDialogService,
    private notification: NotificationService, private previousRouteService: PreviousRouteService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );

    // this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
    //   this.previousUrl = previousUrl;
    //   this.previousLabel = this.previousRouteService.getPreviousUrlFormatted();
    // });
    this.formatDateForDisplay = formatDateService;
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.department = data['quoteData'].department;
    });
  }
}

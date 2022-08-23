import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { FormatDateForDisplay } from 'src/app/core/services/format-date/format-date-display.service';
import { MessageDialogService } from 'src/app/core/services/message-dialog/message-dialog-service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { PreviousRouteService } from 'src/app/core/services/previous-route/previous-route.service';
import { DepartmentClass } from '../../../classes/department-class';


@Component({
  selector: 'rsps-quote-information',
  templateUrl: './quote-information.component.html',
  styleUrls: ['./quote-information.component.css']
})

export class QuoteInformationComponent implements OnInit {
  department!: DepartmentClass;
  submissionCollapsed = false;
  quoteInfoCollapsed = false;
  formatDateForDisplay!: FormatDateForDisplay;
  prevSub!: Subscription;
  previousUrl = '';
  previousLabel = 'Previous';
  invalidList = [];
  authSub: Subscription;
  canEditSubmission = false;
  showInvalid = false;
  invalidMessage = '';
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  constructor(private route: ActivatedRoute, private router: Router, private formatDateService: FormatDateForDisplay,
    private userAuth: UserAuth, private messageDialogService: MessageDialogService, private pageDataService: PageDataService,
    private notification: NotificationService, private previousRouteService: PreviousRouteService) {
    this.authSub = this.userAuth.canEditInsured$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );

    this.prevSub = this.previousRouteService.previousUrl$.subscribe((previousUrl: string) => {
      this.previousUrl = previousUrl;
      this.previousLabel = this.previousRouteService.getPreviousUrlFormatted();
    });
    this.formatDateForDisplay = formatDateService;
  }

  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.department = data['quoteData'].department;
    });
    this.pageDataService.selectedProgram = null;
    console.log(this.department);
  }


  // isValid(): boolean {
  //   if (!this.canEditSubmission) {
  //     return true;
  //   }
  //   if (this.quote.isValid) {
  //     this.hideInvalid();
  //   }
  //   return this.quote.isValid;
  // }

  // isDirty(): boolean {
  //   return this.quote.isDirty;
  // }

  // hideInvalid(): void {
  //   this.showInvalid = false;
  // }

  // showInvalidControls(): void {
  //   this.invalidMessage = '';
  //   // Compile all invalide controls in a list
  //   if (this.quote.invalidList.length > 0) {
  //     this.showInvalid = true;
  //     for (const error of this.quote.invalidList) {
  //       this.invalidMessage += '<br><li>' + error;
  //     }
  //   }

  //   if (this.showInvalid) {
  //     this.invalidMessage = 'Following fields are invalid' + this.invalidMessage;
  //   }
  //   else {
  //     this.hideInvalid();
  //   }
  // }
}

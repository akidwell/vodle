import { state } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { Code } from 'src/app/core/models/code';
import { State } from 'src/app/core/models/state';
import { ConfirmationDialogService } from 'src/app/core/services/confirmation-dialog/confirmation-dialog.service';
import { DropDownsService } from 'src/app/core/services/drop-downs/drop-downs.service';
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
  originalDepartmentInfo!: DepartmentClass;
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
  riskState = '';
  previousState: string|undefined;

  states$: Observable<State[]> | undefined;
  availableAdmittedOptions: Code[] = [];
  availableClaimsMadeOccurrenceOptions: Code[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private formatDateService: FormatDateForDisplay, private dropdowns: DropDownsService,
    private userAuth: UserAuth, private messageDialogService: MessageDialogService, private pageDataService: PageDataService,private confirmationDialogService: ConfirmationDialogService,
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
      this.originalDepartmentInfo = this.department;
    });
    this.states$ = this.dropdowns.getStates();
    this.pageDataService.selectedProgram = null;
    this.previousState = this.department.programMappings[0].quoteData?.riskState;
    console.log(this.previousState);

    console.log(this.department);
    if (this.department.claimsMadeAvailable) {
      const cm: Code = {
        code: 'C',
        key: 1,
        description: 'Claims-Made'
      };
      this.availableClaimsMadeOccurrenceOptions.push(cm);
    }
    if (this.department.occurrenceAvailable) {
      const occ: Code = {
        code: 'O',
        key: 2,
        description: 'Occurrence'
      };
      this.availableClaimsMadeOccurrenceOptions.push(occ);
    }
    if (this.department.admittedAvailable) {
      const admit: Code = {
        code: 'A',
        key: 1,
        description: 'Admitted'
      };
      this.availableAdmittedOptions.push(admit);
    }
    if (this.department.nonAdmittedAvailable) {
      const nonAdmit: Code = {
        code: 'N',
        key: 2,
        description: 'Non-Admitted'
      };
      this.availableAdmittedOptions.push(nonAdmit);
    }
  }
  updateGlobalSettings() {
    this.department.programMappings.forEach(program => {
      program.updateGlobalDefaults(this.department.activeAdmittedStatus, this.department.activeClaimsMadeOrOccurrence);
      if (program.quoteData != null) {
        program.updateGlobalSettings(this.department.activeAdmittedStatus, this.department.activeClaimsMadeOrOccurrence);
      }
    });
  }

  changeState(state: State) {
    console.log(this.previousState);
    this.confirmationDialogService
      .open(
        'Policy State Change Confirmation',
        'Do you wish to overwrite existing Policy State?'
      )
      .then(async (result: boolean) => {
        if (result) {
          if(this.department.programMappings[0].quoteData?.riskState){
            this.department.programMappings[0].quoteData.riskState = String(state);
            this.previousState = String(state);
          }
        } else{
          if(this.department.programMappings[0].quoteData?.riskState){
            this.department.programMappings[0].quoteData.riskState = String(this.previousState);
          }
        }
      });
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

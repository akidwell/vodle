import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { map, filter, tap } from 'rxjs/operators';

import { Subscription, lastValueFrom } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SubmissionClass } from 'src/app/features/submission/classes/SubmissionClass';
import { SubmissionService } from 'src/app/features/submission/services/submission-service/submission-service';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { LayoutEnum } from 'src/app/core/enums/layout-enum';
import { InsuredClass } from 'src/app/features/insured/classes/insured-class';
import { PolicyInformation } from 'src/app/features/policy/models/policy';
import { newInsuredDupeRequst } from 'src/app/features/insured/models/insured-dupe-request';
import { InsuredService } from 'src/app/features/insured/services/insured-service/insured.service';
import { InsuredDuplicatesComponent } from 'src/app/features/insured/components/insured-duplicates/insured-duplicates.component';
import { NotificationService } from 'src/app/core/components/notification/notification-service';
import { HistoricRoute } from 'src/app/core/models/historic-route';
import { EndorsementStatusService } from 'src/app/features/policy/services/endorsement-status/endorsement-status.service';
import { QuoteService } from 'src/app/features/quote/services/quote-service/quote.service';
import { NavigationService } from 'src/app/features/policy/services/navigation/navigation.service';
import { DepartmentClass } from 'src/app/features/quote/classes/department-class';
import { QuoteSavingService } from 'src/app/features/quote/services/quote-saving-service/quote-saving-service.service';
import { ProgramClass } from 'src/app/features/quote/classes/program-class';



@Component({
  selector: 'rsps-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css']
})
export class StatusBarComponent implements OnInit {
  faSearch = faSearch;
  insuredAuthSub!: Subscription;
  submissionAuthSub!: Subscription;
  policyAuthSub!: Subscription;
  lastSubmissionSub!: Subscription;
  disabled = true;
  history: HistoricRoute[] = [];
  canEditSubmission = false;
  canEditInsured = false;
  canEditPolicy = false;
  currentUrl = '';
  userPanelSize = 0;
  headerWidth = 0;
  widthOffset = 0;
  hasSelectedProgram = false;
  selectedProgramSub!: Subscription;
  displayHeaderSub: Subscription;

  constructor(
    private userAuth: UserAuth,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public pageDataService: PageDataService,
    public headerPaddingService: HeaderPaddingService,
    public elementRef: ElementRef,
    public endorsementStatus: EndorsementStatusService,
    private navigationService: NavigationService,
    public quoteSavingService: QuoteSavingService
  ) {
    this.insuredAuthSub = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
    this.submissionAuthSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
    this.policyAuthSub = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
    this.displayHeaderSub = this.pageDataService.noData$.subscribe(
      (displayHeader: boolean) => {
        if(displayHeader){
          this.headerPaddingService.headerPadding = LayoutEnum.header_height;
        }
      }
    );
  }

  ngOnInit() {
    //NavigationStart Hook
    // this.router
    //   .events.pipe(
    //     filter((event: any) => event instanceof NavigationStart),
    //     tap(() => {
    //       this.pageDataService.insuredData = null;
    //       this.pageDataService.submissionData = null;
    //     })).subscribe((customData: any) => {
    //     console.log(customData);
    //   });
    //NavigationEnd Hook
    this.router
      .events.pipe(
        filter((event: any) => event instanceof NavigationEnd),
        tap(() => {
          this.pageDataService.insuredData = null;
          this.pageDataService.submissionData = null;
          this.pageDataService.accountInfo = null;
          this.pageDataService.policyData = null;
          this.pageDataService.lastSubmission = null;
          this.pageDataService.quoteData = null;
        }),
        map((event) => {
          this.headerPaddingService.resetPadding();
          this.currentUrl = event.url;
          let child = this.activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
              if (this.checkData(child)) {
                return true;
              }
            } else {
              this.pageDataService.isNoData = true;
              return null;
            }
          }
          return null;
        })).subscribe();
  }
  ngAfterViewInit(){
    this.pageDataService.selectedProgram$.subscribe(
      (program: ProgramClass | null) => {
        this.hasSelectedProgram = program != null;
      }
    );
  }
  onResize() {
    this.headerPaddingService.onResizeOrLoad();
  }
  checkData(child: ActivatedRoute): boolean {
    this.pageDataService.insuredData = this.checkInsuredData(child);
    this.pageDataService.submissionData = this.checkSubmissionData(child);
    this.pageDataService.quoteData = this.checkQuoteData(child);
    this.pageDataService.policyData = this.checkPolicyData(child);
    return (this.pageDataService.insuredData != null || this.pageDataService.submissionData != null || this.pageDataService.quoteData != null);
  }
  private checkInsuredData(child: ActivatedRoute): InsuredClass | null {
    if (child.snapshot.data && child.snapshot.data['insuredData']) {
      const data: InsuredClass = child.snapshot.data['insuredData'].insured;
      this.headerPaddingService.buttonBarPadding = LayoutEnum.nav_routing_height + LayoutEnum.button_bar_height;
      return data;
    } else {
      return this.pageDataService.insuredData;
    }
  }
  private checkSubmissionData(child: ActivatedRoute): SubmissionClass | null {
    if (child.snapshot.data && child.snapshot.data['submissionData']) {
      const data = child.snapshot.data['submissionData'].submission;
      this.headerPaddingService.buttonBarPadding = LayoutEnum.button_bar_height;
      return data;
    } else {
      return this.pageDataService.submissionData;
    }
  }
  private checkQuoteData(child: ActivatedRoute): DepartmentClass | null {

    if (child.snapshot.data && child.snapshot.data['quoteData']) {
      const data = child.snapshot.data['quoteData'].department;
      this.headerPaddingService.buttonBarPadding = LayoutEnum.button_bar_height;
      return data;
    } else {
      return this.pageDataService.quoteData;
    }
  }
  private checkPolicyData(child: ActivatedRoute): PolicyInformation | null {
    if (child.snapshot.data && child.snapshot.data['policyInfoData']) {
      const data = child.snapshot.data['policyInfoData'].policyInfo;
      this.pageDataService.accountInfo = child.snapshot.data['accountData'].accountInfo;
      this.headerPaddingService.buttonBarPadding = 0;
      return data;
    } else {
      return this.pageDataService.policyData;
    }
  }
}



import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { map, filter, tap } from 'rxjs/operators';

import { Subscription, lastValueFrom } from 'rxjs';
import { UserAuth } from 'src/app/core/authorization/user-auth';
import { SubmissionClass } from 'src/app/features/submission/classes/SubmissionClass';
import { Insured } from 'src/app/features/insured/models/insured';
import { SubmissionService } from 'src/app/features/submission/services/submission-service/submission-service';
import { HeaderPaddingService } from 'src/app/core/services/header-padding-service/header-padding.service';
import { PageDataService } from 'src/app/core/services/page-data-service/page-data-service';
import { LayoutEnum } from 'src/app/core/enums/layout-enum';

export interface HistoricRoute {
  url: string,
  description: string,
  type: string
}

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
  disabled = true;
  history: HistoricRoute[] = [];
  lastRoute: HistoricRoute | null = null;
  canEditSubmission = false;
  canEditInsured = false;
  canEditPolicy = false;
  currentUrl = '';
  notification: any;
  messageDialogService: any;
  showBusy = false;
  userPanelSize = 0;
  headerWidth = 0;
  widthOffset = 0;
  headerLeftMargin = LayoutEnum.sidebar_min_width;
  displayHeaderSub: Subscription;
  @ViewChild('headerBar') headerBarElement!: ElementRef;


  constructor(
    private userAuth: UserAuth,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private submissionService: SubmissionService,
    public pageDataService: PageDataService,
    public headerPaddingService: HeaderPaddingService,
    public elementRef: ElementRef
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
        console.log(displayHeader);
        if(displayHeader){
          this.headerPaddingService.headerPadding = LayoutEnum.header_height;
        } else {
          //this.headerPaddingService.headerPadding = 0;
        }
      }
    );
    this.activatedRoute.data.subscribe(data => {
      console.log(data);
    });
    this.headerPaddingService.sidebarPadding$.subscribe(padding => {
      console.log(padding);
      this.widthOffset = padding;
      this.resetHeaderWidth();
    });
    this.headerPaddingService.userFieldWidth$.subscribe(padding => {
      console.log(padding);
      this.userPanelSize = padding;
      this.resetHeaderWidth();
    });
    console.log(this.activatedRoute, 'test');
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationStart) {
    //     // Show progress spinner or progress bar
    //     console.log('Route change detected');
    //   }

    //   if (event instanceof NavigationEnd) {
    //     // Hide progress spinner or progress bar
    //     console.log(event.url);
    //     console.log(event);
    //     this.history.push(event.url);
    //     console.log(this.history);
    //     this.activatedRoute.data.subscribe(data => {
    //       console.log(data);
    //     });
    //   }

    //   if (event instanceof NavigationError) {
    //     // Hide progress spinner or progress bar

    //     // Present error to user
    //     console.log(event.error);
    //   }
    // });
  }

  ngOnInit() {
    //NavigationStart Hook
    this.router
      .events.pipe(
        filter((event: any) => event instanceof NavigationStart),
        tap(() => {
          this.pageDataService.insuredData = null;
          this.pageDataService.submissionData = null;
        })).subscribe((customData: any) => {
        console.log(customData);
      });
    //NavigationEnd Hook
    this.router
      .events.pipe(
        filter((event: any) => event instanceof NavigationEnd),
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
        })).subscribe((customData: any) => {
        console.log(customData);
      });
  }
  ngAfterViewInit(){
    this.updateHeaderWidth();
  }
  onResize() {
    this.resetHeaderWidth();
  }
  resetHeaderWidth() {
    setTimeout(() => this.headerWidth = 0,0);
    this.updateHeaderWidth();
  }
  updateHeaderWidth(){
    if (this.headerBarElement) {
      //headerWidth = offsetWidth(100% width but need to get pixel count) - user info width - sidebar width - sidebar toggle width
      setTimeout(() => this.headerWidth = this.headerBarElement.nativeElement.offsetWidth - this.userPanelSize - this.widthOffset - LayoutEnum.sidebar_min_width,0);
    }
  }
  checkData(child: ActivatedRoute): boolean {
    this.pageDataService.insuredData = this.checkInsuredData(child);
    this.pageDataService.submissionData = this.checkSubmissionData(child);
    return (this.pageDataService.insuredData != null || this.pageDataService.submissionData != null);
  }
  private checkInsuredData(child: ActivatedRoute): Insured | null {
    if (child.snapshot.data && child.snapshot.data['insuredData']) {
      const data: Insured = child.snapshot.data['insuredData'].insured;
      this.setInsuredPadding();
      this.createInsuredHistory(data);
      return data;
    } else {
      return this.pageDataService.insuredData;
    }
  }
  private checkSubmissionData(child: ActivatedRoute): SubmissionClass | null {
    if (child.snapshot.data && child.snapshot.data['submissionData']) {
      const data = child.snapshot.data['submissionData'].submission;
      this.createSubmissionHistory(data);
      return data;
    } else {
      return this.pageDataService.submissionData;
    }
  }
  private createInsuredHistory(data: Insured) {
    const newRoute: HistoricRoute = {
      type: 'Insured',
      url: this.currentUrl,
      description: data.name || ''
    };
    if (this.compareNewRouteToLast(newRoute)) {
      this.history.splice(0,0,newRoute);

      this.lastRoute = newRoute;
    }
  }
  private createSubmissionHistory(data: SubmissionClass) {
    const newRoute: HistoricRoute = {
      type: 'Submission',
      url: this.currentUrl,
      description: 'Sub# ' + data.submissionNumber
    };
    if (this.compareNewRouteToLast(newRoute)) {
      this.history.push(newRoute);
      this.lastRoute = newRoute;
    }
  }
  setInsuredPadding(){
    //setTimeout(()=>this.headerPaddingService.incrementHeaderPadding(7),0);
    setTimeout(()=>this.headerPaddingService.incrementButtonBarPadding(0),0);
  }
  compareNewRouteToLast(newRoute: HistoricRoute): boolean {
    console.log('new: ', newRoute, 'last: ', this.lastRoute);
    if (this.lastRoute == null || (newRoute.description != this.lastRoute.description || newRoute.type != this.lastRoute.type)) {
      console.log('new');
      return true;
    } else {
      console.log('repeat');
      return false;
    }
  }
  async saveSubmission() {
    let sub: SubmissionClass;
    if (this.pageDataService.submissionData == null) {
      return;
    } else {
      sub = this.pageDataService.submissionData;
    }

    if (sub.submissionNumber === 0) {
      const results$ = this.submissionService.postSubmission(sub);
      await lastValueFrom(results$).then(async submission => {
        sub.submissionNumber = submission.submissionNumber;
        sub.markClean();
        this.notification.show('Submission successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        if (sub.submissionNumber !== null) {
          this.router.navigate(['/submission/' + sub.submissionNumber?.toString() + '/information']);
        }
        return true;
      },
      (error) => {
        this.notification.show('Submission Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
        const errorMessage = error.error?.Message ?? error.message;
        this.messageDialogService.open('Submission Save Error', errorMessage);
        return false;
      });
    } else {
      const results$ = this.submissionService.updateSubmission(sub);
      await lastValueFrom(results$).then(async () => {
        sub.markClean();
        this.notification.show('Submission successfully saved.', { classname: 'bg-success text-light', delay: 5000 });
        return true;
      },
      (error) => {
        this.notification.show('Submission Not Saved.', { classname: 'bg-danger text-light', delay: 5000 });
        const errorMessage = error.error?.Message ?? error.message;
        this.messageDialogService.open('Submission Save Error', errorMessage);
        return false;
      });
    }
    this.showBusy = false;
  }
}



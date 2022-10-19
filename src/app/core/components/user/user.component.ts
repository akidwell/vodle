import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { AuthService } from '../../authorization/auth.service';
import { UserAuth } from '../../authorization/user-auth';
import { faUser, faPowerOff, faKey, faIdBadge, faUserLock, faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { HistoryService } from '../../services/policy-history/policy-history.service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog/confirmation-dialog.service';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import { ConfigService } from '../../services/config/config.service';
import { APIVersionService } from '../../services/api-version-service/api-version.service';
import { HeaderPaddingService } from '../../services/header-padding-service/header-padding.service';

@Component({
  selector: 'rsps-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  userName = '';
  environment = '';
  faUser = faUser;
  faPowerOff = faPowerOff;
  faKey = faKey;
  faIdBadge = faIdBadge;
  faUserLock = faUserLock;
  faPlus = faPlus;
  faMinus = faMinus;
  faTrash = faTrash;
  isAuthenticated = false;
  role = '';
  authSub: Subscription;
  historySub: Subscription;
  isReadOnly = false;
  historySize = 1;
  editPol: Subscription;
  editSub: Subscription;
  editIns: Subscription;
  canEditInsured = false;
  canEditSubmission = false;
  canEditPolicy = false;
  apiOptions: string[] = ['1.0', '2.0'];
  activeAPIVersion = '1.0';
  apiSwitchActive = false;
  @ViewChild('userSettings') userElement!: ElementRef;


  constructor(private userAuth: UserAuth,@Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private configService: ConfigService,
  private apiService: APIVersionService, private authService: AuthService, private historyService: HistoryService,
  private confirmationDialogService: ConfirmationDialogService, public headerPaddingService: HeaderPaddingService, public elementRef:ElementRef) {
    this.authSub = this.userAuth.isApiAuthenticated$.subscribe(
      async (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          const userClaims = await this.oktaAuth.getUser();
          this.userName = userClaims.preferred_username ?? '';
          this.role = userAuth.userRole;
          this.isReadOnly = this.role == 'ReadOnly';
          this.environment = userAuth.environment;
          setTimeout(() => this.headerPaddingService.userFieldWidth = this.userElement.nativeElement.offsetWidth, 0);
        }
      }
    );
    this.editPol = this.userAuth.canEditPolicy$.subscribe(
      (canEditPolicy: boolean) => this.canEditPolicy = canEditPolicy
    );
    this.editSub = this.userAuth.canEditSubmission$.subscribe(
      (canEditSubmission: boolean) => this.canEditSubmission = canEditSubmission
    );
    this.editIns = this.userAuth.canEditInsured$.subscribe(
      (canEditInsured: boolean) => this.canEditInsured = canEditInsured
    );
    this.historySub = this.historyService.policyhistorySize$.subscribe(
      (size: number) => {
        this.historySize = size;
      }
    );
    this.activeAPIVersion = this.apiService.apiVersion;
    this.apiSwitchActive = this.configService.apiSwitchIsActive;
  }
  ngOnDestroy() {
    this.authSub?.unsubscribe();
    this.historySub?.unsubscribe();
  }

  async logout() {
    this.authService.logout();
  }

  addHistoryCount() {
    if (this.historySize < 20) {
      this.historySize++;
      this.historyService.policyhistorySize = this.historySize;
    }
  }

  removeHistoryCount() {
    if (this.historySize > 1) {
      this.historySize--;
      this.historyService.policyhistorySize = this.historySize;
    }
  }
  changeApiVersion(){
    this.apiService.apiVersion = this.activeAPIVersion;
  }
  async clearHistory() {
    const confirm = await this.confirmationDialogService.open('Confirmation', 'Are you sure you want to clear all Policies in your history? Have to refresh to get changes.');
    if (confirm) {
      this.historyService.clearHistory();
    }
  }
}

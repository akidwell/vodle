import { Component, Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../authorization/auth.service';
import { UserAuth } from '../../authorization/user-auth';
import { faUser, faPowerOff, faKey, faIdBadge, faUserLock, faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { PolicyHistoryService } from '../../services/policy-history/policy-history.service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog/confirmation-dialog.service';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import { ConfigService } from '../../services/config/config.service';
import { APIVersionService } from '../../services/API-version-service/api-version.service';

@Component({
  selector: 'rsps-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  userName = '';
  environment = '';
  modalHeader = '';
  modalBody = '';
  oktaToken: string | undefined;
  apiToken: string | undefined;
  modalToken: string | undefined;
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

  constructor(private userAuth: UserAuth,@Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private configService: ConfigService, private apiService: APIVersionService, private authService: AuthService, private modalService: NgbModal, private policyHistoryService: PolicyHistoryService, private confirmationDialogService: ConfirmationDialogService) {
    this.authSub = this.userAuth.isApiAuthenticated$.subscribe(
      async (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          const userClaims = await this.oktaAuth.getUser();
          this.userName = userClaims.preferred_username ?? '';
          this.oktaToken = this.oktaAuth.getAccessToken();
          this.apiToken = userAuth.ApiBearerToken;
          this.role = userAuth.userRole;
          this.isReadOnly = this.role == 'ReadOnly';
          this.environment = userAuth.environment;
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
    this.historySub = this.policyHistoryService.policyhistorySize$.subscribe(
      (size: number) => {
        this.historySize = size;
      }
    );
    this.activeAPIVersion = this.apiService.getApiVersion;
    this.apiSwitchActive = this.configService.apiSwitchIsActive;
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.historySub.unsubscribe();
  }

  async logout() {
    this.authService.logout();
  }

  openOktaModal(content: any) {
    this.modalHeader = 'Okta Token';
    this.modalBody = this.oktaToken ?? '';
    this.triggerModal(content);
  }

  openApiModal(content: any) {
    this.modalHeader = 'Api Token';
    this.modalBody = this.apiToken ?? '';
    this.triggerModal(content);
  }

  triggerModal(content: any) {
    this.modalService.open(content, { scrollable: true, size: 'xl', ariaLabelledBy: 'modal-basic-title' });
  }

  addHistoryCount() {
    if (this.historySize < 20) {
      this.historySize++;
      this.policyHistoryService.policyhistorySize = this.historySize;
    }
  }

  removeHistoryCount() {
    if (this.historySize > 1) {
      this.historySize--;
      this.policyHistoryService.policyhistorySize = this.historySize;
    }
  }
  changeApiVersion(){
    this.apiService.setApiVersion = this.activeAPIVersion;
  }
  async clearHistory() {
    const confirm = await this.confirmationDialogService.open('Confirmation', 'Are you sure you want to clear all Policies in your history? Have to refresh to get changes.');
    if (confirm) {
      this.policyHistoryService.clearHistory();
    }
  }
}

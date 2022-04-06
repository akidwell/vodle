import { Component, Inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../authorization/auth.service';
import { UserAuth } from '../../authorization/user-auth';
import { faUser, faPowerOff, faKey, faIdBadge, faUserLock, faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { PolicyHistoryService } from '../../services/policy-history/policy-history.service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog/confirmation-dialog.service';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';

@Component({
  selector: 'rsps-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userName: string = "";
  environment: string = "";
  modalHeader: string = "";
  modalBody: string = "";
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
  isAuthenticated: boolean = false;
  role: string = "";
  authSub: Subscription;
  historySub: Subscription;
  isReadOnly: boolean = false;
  historySize: number = 1;

  constructor(private userAuth: UserAuth,@Inject(OKTA_AUTH) public oktaAuth: OktaAuth, private authService: AuthService, private modalService: NgbModal, private policyHistoryService: PolicyHistoryService, private confirmationDialogService: ConfirmationDialogService) {  
    this.authSub = this.userAuth.isApiAuthenticated$.subscribe(
      async (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated
        if (isAuthenticated) {
          const userClaims = await this.oktaAuth.getUser();
          this.userName = userClaims.preferred_username ?? "";
          this.oktaToken = this.oktaAuth.getAccessToken();
          this.apiToken = userAuth.ApiBearerToken;
          this.role = userAuth.userRole;
          this.isReadOnly = this.role == "ReadOnly";
          this.environment = userAuth.environment;        
        }
      }
    );

    this.historySub = this.policyHistoryService.policyhistorySize$.subscribe(
      (size: number) => {
        this.historySize = size;
      }
    );
  }

  async ngOnInit(): Promise<void> { }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.historySub.unsubscribe();
  }

  async logout() {
    this.authService.logout();
  }

  openOktaModal(content: any) {
    this.modalHeader = "Okta Token";
    this.modalBody = this.oktaToken ?? "";
    this.triggerModal(content);
  }

  openApiModal(content: any) {
    this.modalHeader = "Api Token";
    this.modalBody = this.apiToken ?? "";
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

  async clearHistory() {
    const confirm = await this.confirmationDialogService.open("Confirmation", "Are you sure you want to clear all Policies in your history? Have to refresh to get changes.");
    if (confirm) {
      this.policyHistoryService.clearHistory();
    }
  }
}

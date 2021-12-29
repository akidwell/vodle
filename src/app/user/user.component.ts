import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OktaAuthService } from '@okta/okta-angular';
import { AuthService } from '../authorization/auth.service';
import { UserAuth } from '../authorization/user-auth';
import { faUser, faPowerOff, faKey, faIdBadge, faUserLock } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rsps-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userName: string = "";
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
  isAuthenticated: boolean = false;
  role: string = "";
  authSub: Subscription;
  roleSub: Subscription;
  isReadOnly: boolean = false;

  constructor(private userAuth: UserAuth, public oktaAuth: OktaAuthService, private authService: AuthService, private modalService: NgbModal) {
    this.oktaAuth.$authenticationState.subscribe(
      async (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        if (isAuthenticated) {
          const userClaims = await this.oktaAuth.getUser();
          this.userName = userClaims.preferred_username ?? "";
          this.oktaToken = this.oktaAuth.getAccessToken();
        }
      }
    );
    this.authSub = this.userAuth.ApiBearerToken$.subscribe(
      (ApiBearerToken: string) => { this.apiToken = ApiBearerToken }
    );

    this.roleSub = this.userAuth.userRole$.subscribe(
      (userRole: string) => {
        this.role = userRole;
        this.isReadOnly = userRole == "ReadOnly";
      }
    );
  }

  async ngOnInit(): Promise<void> { }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.roleSub.unsubscribe();
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

}




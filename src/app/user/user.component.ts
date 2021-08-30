import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OktaAuthService } from '@okta/okta-angular';
import { AuthService } from '../authorization/auth.service';
import { UserAuth } from '../authorization/user-auth';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPowerOff, faKey, faIdBadge } from '@fortawesome/free-solid-svg-icons';
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
  isAuthenticated: boolean = false;
  authSub: Subscription;

  constructor(private userAuth: UserAuth, public oktaAuth: OktaAuthService, private authService: AuthService, private modalService: NgbModal) {
    // GAM - TEMP -Subscribe
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
  }

  async ngOnInit(): Promise<void> {
    // GAM - TEMP -Subscribe
    // const userClaims = await this.oktaAuth.getUser();
    // this.userName = userClaims.preferred_username ?? "";
    // this.oktaToken = this.oktaAuth.getAccessToken();
    //this.apiToken = this.userAuth.bearerToken;
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
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




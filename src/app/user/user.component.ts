import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OktaAuthService } from '@okta/okta-angular';
import { AuthService } from '../authorization/auth.service';
import { UserAuth } from '../authorization/user-auth';

@Component({
  selector: 'rsps-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userName: string = "";
  oktaToken: string | undefined;
  apiToken: string | undefined;
  modalToken: string | undefined;

  constructor(private userAuth: UserAuth, public oktaAuth: OktaAuthService,  private authService: AuthService,private modalService: NgbModal){}

  async ngOnInit(): Promise<void> {
    const userClaims = await this.oktaAuth.getUser();
    this.userName = userClaims.preferred_username ?? "";

    this.oktaToken =this.oktaAuth.getAccessToken();
    this.apiToken = this.userAuth.bearerToken;
  }

  logout() {
    this.authService.logout();
  }

  triggerModal(content: any) {
    this.modalService.open(content, {scrollable: true, size: 'xl', ariaLabelledBy: 'modal-basic-title'}).result.then((res) => { 
    }, (res) => {
    });
  }
}




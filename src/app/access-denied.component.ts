import { Component } from '@angular/core';
import { AuthService } from './authorization/auth.service';

@Component({
  template: `<div class='error-message'>
    <h1>Access Denied!</h1>
    <button class="btn btn-md btn-primary" style="float:center;" (click)="logout()">Retry</button>
    </div>`,
    styleUrls: ['./app.component.css']
})
export class AccessDeniedComponent {

  constructor(private authService: AuthService) { }
  
  logout()
  {
    this.authService.logout();
  }

 }



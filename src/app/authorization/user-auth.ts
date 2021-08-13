import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserAuth {
  userName: string = "";
  bearerToken: string = "";
  isAuthenticated: string = "false";
  canExecuteImport: string = "false";

  init():void {
    this.userName = "";
    this.bearerToken = "";
    this.isAuthenticated = "false";
    this.canExecuteImport = "false";
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserAuth {
  userName: string = "";
  bearerToken: string = "";
  isAuthenticated: string = "false";
  canExecuteImport: string = "false";

  // GAM - TEMP - Header test
  private _isApiAuthenticated = new BehaviorSubject<boolean>(false);
  isApiAuthenticated$ = this._isApiAuthenticated.asObservable();
  get isApiAuthenticated(): boolean { return this._isApiAuthenticated.getValue(); }
  set isApiAuthenticated(value: boolean) { this._isApiAuthenticated.next(value); }

  // GAM - TEMP - Header test
  private _apiBearerToken = new BehaviorSubject<string>("");
  ApiBearerToken$ = this._apiBearerToken.asObservable();
  get ApiBearerToken(): string { return this._apiBearerToken.getValue(); }
  set ApiBearerToken(value: string) { this._apiBearerToken.next(value); }

  // GAM - TEMP - Header test
  private _canExecuteImport2 = new BehaviorSubject<boolean>(false);
  canExecuteImport2$ = this._canExecuteImport2.asObservable();
  get canExecuteImport2(): boolean { return this._canExecuteImport2.getValue(); }
  set canExecuteImport2(value: boolean) { this._canExecuteImport2.next(value); }


  init(): void {
    this.userName = "";
    this.bearerToken = "";
    this.isAuthenticated = "false";
    this.canExecuteImport = "false";
  }


}

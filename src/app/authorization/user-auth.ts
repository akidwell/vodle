import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserAuth {
  userId: string = "";
  userName: string = "";
  bearerToken: string = "";
  isAuthenticated: boolean = false;

  private _isApiAuthenticated = new BehaviorSubject<boolean>(false);
  isApiAuthenticated$ = this._isApiAuthenticated.asObservable();
  get isApiAuthenticated(): boolean { return this._isApiAuthenticated.getValue(); }
  set isApiAuthenticated(value: boolean) { this._isApiAuthenticated.next(value); }

  private _apiBearerToken = new BehaviorSubject<string>("");
  ApiBearerToken$ = this._apiBearerToken.asObservable();
  get ApiBearerToken(): string { return this._apiBearerToken.getValue(); }
  set ApiBearerToken(value: string) { this._apiBearerToken.next(value); }

  private _canExecuteImport = new BehaviorSubject<boolean>(false);
  canExecuteImport$ = this._canExecuteImport.asObservable();
  get canExecuteImport(): boolean { return this._canExecuteImport.getValue(); }
  set canExecuteImport(value: boolean) { this._canExecuteImport.next(value); }

  private _canEditPolicy = new BehaviorSubject<boolean>(false);
  canEditPolicy$ = this._canEditPolicy.asObservable();
  get canEditPolicy(): boolean { return this._canEditPolicy.getValue(); }
  set canEditPolicy(value: boolean) { this._canEditPolicy.next(value); }

  private _userRole = new BehaviorSubject<string>("");
  userRole$ = this._userRole.asObservable();
  get userRole(): string { return this._userRole.getValue(); }
  set userRole(value: string) { this._userRole.next(value); }

  private _loaded$ = new BehaviorSubject<boolean>(false);
  get loaded$() { return this._loaded$.asObservable(); }
  loaded() {
    this._loaded$.next(true);
  }
  
  
  init(): void {
    this.userName = "";
    this.bearerToken = "";
  }

}
